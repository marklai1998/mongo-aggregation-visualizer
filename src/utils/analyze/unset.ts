import type { Unset } from '@/types/aggregation.ts';
import { type AnalysisResult, FieldType } from '@/utils/analyze/index.ts';

export const analyzeUnset = (
  state: AnalysisResult,
  baseCollection: string,
  stage: Unset,
) => {
  const content = stage.$unset;

  if (typeof content === 'string') {
    state.collection[baseCollection].fields[content] = {
      type: FieldType.DEFAULT,
    };
  } else {
    for (const key of content) {
      state.collection[baseCollection].fields[String(key)] = {
        type: FieldType.DEFAULT,
      };
    }
  }
};
