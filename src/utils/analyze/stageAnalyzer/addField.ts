import type { AddField } from '@/types/aggregation.ts';
import {
  type AnalysisResult,
  FieldType,
  type StageAnalyzer,
  TMP_COLLECTION,
} from '@/utils/analyze';
import { isExpression } from '@/utils/analyze/analyzeUtil.ts';
import { assocPath } from 'ramda';

export const addFieldRecursive = (
  state: AnalysisResult,
  baseCollection: string,
  stage: AddField['$addFields'],
  baseKey?: string,
) => {
  for (const [key, content] of Object.entries(stage)) {
    if (content === null || content === undefined) continue;
    if (typeof content === 'object' && !isExpression(content)) {
      addFieldRecursive(
        state,
        baseCollection,
        content,
        baseKey ? `${baseKey}.${key}` : key,
      );
    } else {
      const path = baseKey ? `${baseKey}.${key}` : key;

      const expression = isExpression(content);

      state.result = assocPath(
        path.split('.'),
        {
          id: {
            collection: TMP_COLLECTION,
            path,
          },
          type: FieldType.DEFAULT,
          valueLiteral: expression ? undefined : String(content),
          status: expression
            ? [
                {
                  isExpression: true,
                  expression: content,
                },
              ]
            : [],
        },
        state.result,
      );
    }
  }
};

export const analyzeAddField: StageAnalyzer<AddField> = ({
  state,
  collection,
  stage: { $addFields: stage },
}) => {
  addFieldRecursive(state, collection, stage);
};
