import type { Unset } from '@/types/aggregation.ts';
import { type AnalysisResult, FieldType } from '@/utils/analyze/index.ts';

export const analyzeUnset = (
  state: AnalysisResult,
  baseCollection: string,
  stage: Unset,
) => {
  const content = stage.$unset;

  for (const key of typeof content === 'string' ? [content] : content) {
    state.collection[baseCollection].fields[key] = {
      type: FieldType.DEFAULT,
    };
  }
};
