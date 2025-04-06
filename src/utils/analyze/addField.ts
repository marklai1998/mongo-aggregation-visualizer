import type { AddField } from '@/types/aggregation.ts';
import { type AnalysisResult, FieldType } from '@/utils/analyze/index.ts';

export const analyzeAddField = (
  state: AnalysisResult,
  baseCollection: string,
  stage: AddField,
) => {
  const content = stage.$addFields;
  const keys = Object.keys(content);
  for (const key of keys) {
    state.collections[baseCollection].fields[String(key)] = {
      type: FieldType.DEFAULT,
    };
  }
};
