import type { Unset } from '@/types/aggregation.ts';
import { FieldType, type StageAnalyzer } from '@/utils/analyze/index.ts';
import { getColor } from '@/utils/getColor.ts';
import { assocPath, dissocPath, hasPath } from 'ramda';

export const analyzeUnset: StageAnalyzer<Unset> = ({
  state,
  collection,
  stage,
  idx,
}) => {
  const content = stage.$unset;

  for (const key of typeof content === 'string' ? [content] : content) {
    const path = key.split('.');
    const id = `${collection}.${key}`;

    const isTmpField =
      !hasPath(path, state.collections[collection].fields) &&
      hasPath(path, state.result);

    if (!isTmpField) {
      state.collections[collection].fields = assocPath(
        path,
        {
          id,
          type: FieldType.DEFAULT,
          color: getColor(id),
          status: [{ isUnseted: true, step: idx }],
        },
        state.collections[collection].fields,
      );
    }

    state.result = dissocPath(path, state.result);
  }
};
