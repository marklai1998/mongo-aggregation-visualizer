import { FIELD_SYMBOL, type Field } from '@/utils/analyze/index.ts';

export const isField = (v: unknown): v is Field =>
  typeof v === 'object' &&
  v !== null &&
  '_type' in v &&
  v._type === FIELD_SYMBOL;

export const isExpression = (v: unknown) =>
  v && typeof v === 'object' && Object.keys(v).some((v) => v.startsWith('$'));

export const isReferencePath = (v: unknown) =>
  typeof v === 'string' && v.startsWith('$');
