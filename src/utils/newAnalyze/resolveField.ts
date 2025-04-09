import { isExpression, isFieldResult } from '@/utils/newAnalyze/analyzeUtil.ts';
import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  type Field,
  type State,
  ValueType,
} from '@/utils/newAnalyze/index.ts';
import { assocPath, path as pathFn, tail } from 'ramda';

export const resolveField = ({
  prevState,
  path,
  state,
  value,
  srcOnly = false,
}: {
  state: State;
  prevState: State;
  path: string;
  value?: unknown;
  srcOnly?: boolean;
}): Field => {
  const isReference = typeof value === 'string' && value.startsWith('$');

  if (isReference) {
    const newField = resolveField({
      prevState,
      path: tail(value),
      state,
      srcOnly: true,
    });
    state.results = state.results.map(assocPath(path.split('.'), newField));
    return newField;
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
  const prevResultItem = pathFn(path.split('.'), prevResultItemDoc);

  if (isFieldResult(prevResultItem)) {
    state.results = state.results.map(
      assocPath(path.split('.'), {
        ...prevResultItem,
        ...(newValue ? { value: newValue } : {}),
      }),
    );

    return prevResultItem;
  }

  const prevCollectionItem = pathFn(
    path.split('.'),
    state.collections[DEFAULT_COLLECTION].fields,
  );

  if (isFieldResult(prevCollectionItem)) {
    // If its already in collection, use it
    if (!srcOnly) {
      state.results = state.results.map(
        assocPath(path.split('.'), prevCollectionItem),
      );
    }
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

  if (srcOnly) {
    state.collections[DEFAULT_COLLECTION].fields = assocPath(
      path.split('.'),
      newField,
      state.collections[DEFAULT_COLLECTION].fields,
    );
  }
  if (!srcOnly) {
    state.results = state.results.map(assocPath(path.split('.'), newField));
  }

  return newField;
};
