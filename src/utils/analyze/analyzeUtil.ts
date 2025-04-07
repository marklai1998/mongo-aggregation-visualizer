import type { Document, Field, State } from '@/utils/analyze/index.ts';
import { hasPath } from 'ramda';

export const isTmpField = ({
  state,
  path,
  collection,
}: {
  state: State;
  path: string;
  collection: string;
}) =>
  !hasPath(path.split('.'), state.collections[collection].fields) &&
  hasPath(path.split('.'), state.result);

export const isFieldResult = (v: Document | Field): v is Field => 'type' in v;
export const isExpression = (v: object) =>
  Object.keys(v).some((v) => v.startsWith('$'));
