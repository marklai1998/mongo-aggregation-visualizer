import type { Unset } from '@/types/aggregation.ts';
import { FieldType, type StageAnalyzer } from '@/utils/analyze';
import { isTmpField } from '@/utils/analyze/analyzeUtil.ts';
import { assocPath, clone, dissocPath } from 'ramda';

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
        collection,
        path: key,
      })
    ) {
      state.collections[collection].fields = assocPath(
        key.split('.'),
        {
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
