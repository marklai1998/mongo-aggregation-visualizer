import type { Project } from '@/types/aggregation.ts';
import type { AnalysisResult, StageAnalyzer } from '@/utils/analyze';
import {
  addField,
  isExpression,
  removeField,
} from '@/utils/analyze/analyzeUtil.ts';

export const projectRecursive = ({
  state,
  collection,
  stage,
  baseKey,
  idx,
}: {
  state: AnalysisResult;
  collection: string;
  stage: Project['$project'];
  baseKey?: string;
  idx: number;
}) => {
  for (const [key, content] of Object.entries(stage)) {
    if (content === null || content === undefined) continue;

    const path = baseKey ? `${baseKey}.${key}` : key;

    if (typeof content === 'object' && !isExpression(content)) {
      projectRecursive({
        state,
        collection,
        stage: content,
        baseKey: path,
        idx,
      });
    } else {
      if (content) {
        addField({
          state,
          path,
          collection: collection,
          content,
        });
      } else {
        removeField({
          state,
          path,
          collection: collection,
          idx,
        });
      }
    }
  }
};

export const analyzeProject: StageAnalyzer<Project> = ({
  state,
  collection,
  stage: { $project: stage },
  idx,
}) => {
  projectRecursive({ state, collection, stage, idx });
};
