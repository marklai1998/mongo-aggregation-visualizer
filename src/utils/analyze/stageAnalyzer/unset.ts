import type { Unset } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/analyze';
import { removeField } from '@/utils/analyze/analyzeUtil.ts';

export const analyzeUnset: StageAnalyzer<Unset> = ({
  state,
  collection,
  stage: { $unset: stage },
  idx,
}) => {
  for (const key of typeof stage === 'string' ? [stage] : stage) {
    const path = key;

    removeField({
      state,
      collection,
      path,
      idx,
    });
  }
};
