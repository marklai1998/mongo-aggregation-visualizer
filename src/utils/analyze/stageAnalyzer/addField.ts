import type { AddField } from '@/types/aggregation.ts';
import {
  FieldType,
  type StageAnalyzer,
  type State,
  TMP_COLLECTION,
} from '@/utils/analyze';
import { isExpression } from '@/utils/analyze/analyzeUtil.ts';
import { assocPath, clone } from 'ramda';

export const addFieldRecursive = (
  state: State,
  baseCollection: string,
  stage: AddField['$addFields'],
  baseKey?: string,
): State =>
  Object.entries(stage).reduce((state, [key, content]) => {
    if (content === null || content === undefined) return state;
    if (typeof content === 'object' && !isExpression(content)) {
      return addFieldRecursive(
        state,
        baseCollection,
        content,
        baseKey ? `${baseKey}.${key}` : key,
      );
    }

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

    return state;
  }, clone(state));

export const analyzeAddField: StageAnalyzer<AddField> = ({
  state,
  collection,
  stage: { $addFields: stage },
}) => addFieldRecursive(state, collection, stage);
