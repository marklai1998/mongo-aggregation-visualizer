import {
  type AnalysisResult,
  type Document,
  type Field,
  FieldType,
} from '@/utils/analyze/index.ts';
import { assocPath, dissocPath, hasPath } from 'ramda';

export const isTmpField = ({
  state,
  path,
  collection,
}: {
  state: AnalysisResult;
  path: string;
  collection: string;
}) =>
  !hasPath(path.split('.'), state.collections[collection].fields) &&
  hasPath(path.split('.'), state.result);

export const isFieldResult = (v: Document | Field): v is Field => 'type' in v;
export const isExpression = (v: object) =>
  Object.keys(v).some((v) => v.startsWith('$'));

export const removeField = ({
  state,
  path,
  collection,
  idx,
}: {
  state: AnalysisResult;
  path: string;
  collection: string;
  idx: number;
}) => {
  if (
    !isTmpField({
      state,
      collection,
      path,
    })
  ) {
    state.collections[collection].fields = assocPath(
      path.split('.'),
      {
        id: {
          collection,
          path,
        },
        type: FieldType.DEFAULT,
        status: [{ isUnseted: true, step: idx }],
      },
      state.collections[collection].fields,
    );
  }

  state.result = dissocPath(path.split('.'), state.result);
};

export const addField = ({
  state,
  path,
  collection,
  content,
}: {
  state: AnalysisResult;
  path: string;
  collection: string;
  content: object;
}) => {
  const expression = isExpression(content);

  const tmp = isTmpField({
    state,
    collection,
    path,
  });

  if (!tmp) {
    state.collections[collection].fields = assocPath(
      path.split('.'),
      {
        id: {
          collection,
          path,
        },
        type: FieldType.DEFAULT,
        status: [],
      },
      state.collections[collection].fields,
    );
    state.result = assocPath(
      path.split('.'),
      {
        id: {
          collection,
          path,
        },
        type: FieldType.DEFAULT,
        status: expression
          ? [
              {
                isExpression: true,
                expression: content,
              },
            ]
          : [],
      },
      state.result,
    );
  }
};
