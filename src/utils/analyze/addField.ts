import type { AddField } from '@/types/aggregation.ts';
import {
  type AnalysisResult,
  FieldType,
  type StageAnalyzer,
} from '@/utils/analyze/index.ts';
import { getColor } from '@/utils/getColor.ts';
import { assocPath } from 'ramda';

export const addFieldRecursive = (
  state: AnalysisResult,
  baseCollection: string,
  stage: AddField['$addFields'],
  baseKey?: string,
) => {
  // TODO: expression support
  for (const [key, content] of Object.entries(stage)) {
    if (content === null || content === undefined) continue;
    if (typeof content === 'object') {
      addFieldRecursive(
        state,
        baseCollection,
        content,
        baseKey ? `${baseKey}.${key}` : key,
      );
    } else {
      const path = baseKey ? `${baseKey}.${key}` : key;
      // Add field is not form any collection
      // TODO: prevent collection called tmp
      const id = `tmp.${path}`;

      state.result = assocPath(
        path.split('.'),
        {
          id,
          type: FieldType.DEFAULT,
          color: getColor(id),
          valueLiteral: String(content),
          status: [],
        },
        state.result,
      );
    }
  }
};

export const analyzeAddField: StageAnalyzer<AddField> = ({
  state,
  collection,
  stage,
}) => {
  const content = stage.$addFields;
  addFieldRecursive(state, collection, content);
};
