import type { Set as SetStage } from '@/types/aggregation.ts';
import { isExpression, isReferencePath } from '@/utils/analyze/analyzeUtil.ts';
import { resolveField } from '@/utils/analyze/resolveField.ts';
import { recursive } from '@/utils/recursive.ts';
import { assocPath, clone } from 'ramda';
import {
  FIELD_SYMBOL,
  type Field,
  type StageAnalyzer,
  TMP_COLLECTION,
  ValueType,
} from '..';

export const setStage: StageAnalyzer<SetStage> = ({
  state: prevState,
  states = [],
  stage: { $set: stage },
}) => {
  const state = clone(prevState);

  recursive({
    object: stage,
    callback: ({ value, path }) => {
      const resolvedField = resolveField({
        prevStates: states,
        path,
        state,
        value,
        setSrc: false,
      });

      const newValue: Field['value'] =
        value && !isReferencePath(value)
          ? isExpression(value)
            ? {
                type: ValueType.EXPRESSION,
                expression: value,
              }
            : {
                type: ValueType.STRING,
                value: String(value),
              }
          : undefined;

      state.results = state.results.map(
        assocPath(
          path.split('.'),
          isReferencePath(value)
            ? { ...resolvedField, ...(newValue ? { value: newValue } : {}) }
            : {
                _type: FIELD_SYMBOL,
                id: {
                  collection: TMP_COLLECTION,
                  path,
                },
                ...(newValue ? { value: newValue } : {}),
              },
        ),
      );
    },
  });

  return state;
};
