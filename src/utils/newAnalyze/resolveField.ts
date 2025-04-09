import { isExpression, isFieldResult } from '@/utils/newAnalyze/analyzeUtil.ts';
import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  type Field,
  type State,
  ValueType,
} from '@/utils/newAnalyze/index.ts';
import { assocPath, path as pathFn } from 'ramda';

export const resolveField = ({
  prevState,
  path,
  state,
  value,
}: { state: State; prevState: State; path: string; value?: unknown }) => {
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
        value: newValue,
      }),
    );

    return;
  }

  const prevCollectionItem = pathFn(
    path.split('.'),
    state.collections[DEFAULT_COLLECTION].fields,
  );

  if (isFieldResult(prevCollectionItem)) {
    // If its already in collection, use it
    state.results = state.results.map(
      assocPath(path.split('.'), prevCollectionItem),
    );
    return;
  }

  // Set it in both src collection and result

  const newField: Field = {
    _type: FIELD_SYMBOL,
    id: {
      collection: DEFAULT_COLLECTION,
      path,
    },
    value: newValue,
  };

  state.collections[DEFAULT_COLLECTION].fields = assocPath(
    path.split('.'),
    newField,
    state.collections[DEFAULT_COLLECTION].fields,
  );
  state.results = state.results.map(assocPath(path.split('.'), newField));
};
