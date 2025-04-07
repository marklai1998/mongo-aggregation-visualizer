import {
  FIELD_SYMBOL,
  type Field,
  type State,
  TMP_COLLECTION,
} from '@/utils/analyze/index.ts';
import { path as pathFn } from 'ramda';

export const isTmpField = ({
  state,
  path,
}: {
  state: State;
  path: string;
}) => {
  const item = pathFn(path.split('.'), state.result);
  return isFieldResult(item) && item.id.collection === TMP_COLLECTION;
};

export const isFieldResult = (v: unknown): v is Field =>
  typeof v === 'object' &&
  v !== null &&
  '_type' in v &&
  v._type === FIELD_SYMBOL;

export const isExpression = (v: object) =>
  Object.keys(v).some((v) => v.startsWith('$'));
