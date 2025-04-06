import type { Unset } from '@/types/aggregation.ts';
import { type AnalysisResult, FieldType } from '@/utils/analyze/index.ts';
import { getColor } from '@/utils/getColor.ts';
import { assocPath, dissocPath } from 'ramda';

export const analyzeUnset = (
  state: AnalysisResult,
  baseCollection: string,
  stage: Unset,
) => {
  const content = stage.$unset;

  for (const key of typeof content === 'string' ? [content] : content) {
    const path = key.split('.');

    state.collections[baseCollection].fields = assocPath(
      path,
      { type: FieldType.DEFAULT, color: getColor(`${baseCollection}.${key}`) },
      state.collections[baseCollection].fields,
    );

    state.result = dissocPath(path, state.result);
  }
};
