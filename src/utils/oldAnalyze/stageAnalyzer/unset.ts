import type { Unset } from '@/types/aggregation.ts';
import { isTmpField } from '@/utils/oldAnalyze/analyzeUtil.ts';
import { assocPath, clone, dissocPath } from 'ramda';
import { FIELD_SYMBOL, FieldType, type StageAnalyzer } from '..';

export const analyzeUnset: StageAnalyzer<Unset> = ({
  state,
  collection,
  stage: { $unset: stage },
  idx,
}) =>
  (typeof stage === 'string' ? [stage] : stage).reduce((state, key) => {
    if (
      !isTmpField({
        state,
        path: key,
      })
    ) {
      state.collections[collection].fields = assocPath(
        key.split('.'),
        {
          _type: FIELD_SYMBOL,
          id: {
            collection,
            path: key,
          },
          type: FieldType.DEFAULT,
          status: [{ isUnseted: true, step: idx }],
        },
        state.collections[collection].fields,
      );
    }

    state.result = dissocPath(key.split('.'), state.result);

    return state;
  }, clone(state));
