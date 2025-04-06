import type { AddField } from '@/types/aggregation.ts';
import {
  type AnalysisResult,
  FieldType,
  type StageAnalyzer,
} from '@/utils/analyze';
import { isExpression } from '@/utils/analyze/analyzeUtil.ts';
import { getColor } from '@/utils/getColor.ts';
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
      // Add field is not form any collection
      // TODO: prevent collection called tmp
      const id = `tmp.${path}`;
      const expression = isExpression(content);

      state.result = assocPath(
        path.split('.'),
        {
          id,
          type: FieldType.DEFAULT,
          color: getColor(id),
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
  stage,
}) => {
  const content = stage.$addFields;
  addFieldRecursive(state, collection, content);
};
