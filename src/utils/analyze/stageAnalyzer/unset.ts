import type { Unset } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/analyze';
import { removeField } from '@/utils/analyze/analyzeUtil.ts';

export const analyzeUnset: StageAnalyzer<Unset> = ({
  state,
  collection,
  stage,
  idx,
}) => {
  const content = stage.$unset;

  for (const key of typeof content === 'string' ? [content] : content) {
    const path = key;

    removeField({
      state,
      collection,
      path,
      idx,
    });
  }
};
