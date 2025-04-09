import type { Set as SetStage } from '@/types/aggregation.ts';
import { type Field, type StageAnalyzer, ValueType } from '@/utils/newAnalyze';
import {
  isExpression,
  isReferencePath,
} from '@/utils/newAnalyze/analyzeUtil.ts';
import { resolveField } from '@/utils/newAnalyze/resolveField.ts';
import { recursive } from '@/utils/recursive.ts';
import { assocPath, clone } from 'ramda';

export const setStage: StageAnalyzer<SetStage> = ({
  state: prevState,
  stage: { $set: stage },
}) => {
  const state = clone(prevState);

  recursive({
    object: stage,
    callback: ({ value, path }) => {
      const resolvedField = resolveField({
        prevState,
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
        assocPath(path.split('.'), {
          ...resolvedField,
          ...(newValue ? { value: newValue } : {}),
        }),
      );
    },
  });

  return state;
};
