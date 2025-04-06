import type { AddField } from '@/types/aggregation.ts';
import { type AnalysisResult, FieldType } from '@/utils/analyze/index.ts';
import { getColor } from '@/utils/getColor.ts';

export const analyzeAddField = (
  state: AnalysisResult,
  baseCollection: string,
  stage: AddField,
) => {
  const content = stage.$addFields;
  const keys = Object.keys(content);
  for (const key of keys) {
    const id = `${baseCollection}.${key}`;
    state.collections[baseCollection].fields[String(key)] = {
      id,
      type: FieldType.DEFAULT,
      color: getColor(id),
    };
  }
};
