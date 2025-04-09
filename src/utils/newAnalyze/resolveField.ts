import { isExpression, isFieldResult } from '@/utils/newAnalyze/analyzeUtil.ts';
import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  type Field,
  type State,
  TMP_COLLECTION,
  ValueType,
} from '@/utils/newAnalyze/index.ts';
import { assocPath, path as pathFn } from 'ramda';

export const resolveField = ({
  prevState,
  path,
  state,
  value,
}: { state: State; prevState: State; path: string; value: unknown }) => {
  const expression = isExpression(value);

  const prevResultItemDoc = prevState.results.find(pathFn(path.split('.')));
  const prevResultItem = pathFn(path.split('.'), prevResultItemDoc);

  if (isFieldResult(prevResultItem)) {
    if (expression) {
      // If its expression ignore it treat it as new field
      state.results = state.results.map(
        assocPath(path.split('.'), {
          ...prevResultItem,
          value: {
            type: ValueType.EXPRESSION,
            expression: value,
          },
        }),
      );
      return;
    }
    // If field is in prev document, do nothing
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
    value: expression
      ? {
          type: ValueType.EXPRESSION,
          expression: value,
        }
      : {
          type: ValueType.STRING,
          value: String(value),
        },
  };

  state.collections[DEFAULT_COLLECTION].fields = assocPath(
    path.split('.'),
    newField,
    state.collections[DEFAULT_COLLECTION].fields,
  );
  state.results = state.results.map(assocPath(path.split('.'), newField));
};
