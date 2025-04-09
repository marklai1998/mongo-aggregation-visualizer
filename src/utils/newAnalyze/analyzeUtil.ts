import { FIELD_SYMBOL, type Field } from '@/utils/newAnalyze/index.ts';

export const isFieldResult = (v: unknown): v is Field =>
  typeof v === 'object' &&
  v !== null &&
  '_type' in v &&
  v._type === FIELD_SYMBOL;

export const isExpression = (v: unknown) =>
  v && typeof v === 'object' && Object.keys(v).some((v) => v.startsWith('$'));
