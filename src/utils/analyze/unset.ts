import type { Unset } from '@/types/aggregation.ts';
import { type AnalysisResult, FieldType } from '@/utils/analyze/index.ts';
import { assocPath } from 'ramda';

export const analyzeUnset = (
  state: AnalysisResult,
  baseCollection: string,
  stage: Unset,
) => {
  const content = stage.$unset;

  for (const key of typeof content === 'string' ? [content] : content) {
    state.collections[baseCollection].fields = assocPath(
      key.split('.'),
      { type: FieldType.DEFAULT },
      state.collections[baseCollection].fields,
    );
  }
};
