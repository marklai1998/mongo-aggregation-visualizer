import { isExpression, isFieldResult } from '@/utils/analyze/analyzeUtil.ts';
import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  type Field,
  type State,
  ValueType,
} from '@/utils/analyze/index.ts';
import { assocPath, path as pathFn, tail } from 'ramda';

export const resolveField = ({
  prevState,
  path,
  state,
  value,
  setSrc = true,
}: {
  state: State;
  prevState: State;
  path: string;
  value?: unknown;
  setSrc: boolean;
}): Field | Document => {
  const isReference = typeof value === 'string' && value.startsWith('$');

  if (isReference) {
    return resolveField({
      prevState,
      path: tail(value),
      state,
      setSrc: true,
    });
  }

  const newValue: Field['value'] = value
    ? isExpression(value)
      ? {
          type: ValueType.EXPRESSION,
          expression: value,
        }
      : {
          type: ValueType.STRING,
          value: String(value),
        }
    : undefined;

  const prevResultItemDoc = prevState.results.find(pathFn(path.split('.')));
  const prevResultItem = pathFn<Document | Field>(
    path.split('.'),
    prevResultItemDoc,
  );

  if (prevResultItem) {
    return prevResultItem;
  }

  const prevCollectionItem = pathFn(
    path.split('.'),
    state.collections[DEFAULT_COLLECTION].fields,
  );

  if (isFieldResult(prevCollectionItem)) {
    // If its already in collection, use it
    return prevCollectionItem;
  }

  // Set it in both src collection and result

  const newField: Field = {
    _type: FIELD_SYMBOL,
    id: {
      collection: DEFAULT_COLLECTION,
      path,
    },
    ...(newValue ? { value: newValue } : {}),
  };

  if (setSrc) {
    state.collections[DEFAULT_COLLECTION].fields = assocPath(
      path.split('.'),
      newField,
      state.collections[DEFAULT_COLLECTION].fields,
    );
  }

  return newField;
};
