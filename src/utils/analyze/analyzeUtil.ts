import {
  type AnalysisResult,
  type Document,
  type Field,
  FieldType,
} from '@/utils/analyze/index.ts';
import { getColor } from '@/utils/getColor.ts';
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
  const id = `${collection}.${path}`;

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
        id,
        type: FieldType.DEFAULT,
        color: getColor(id),
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
  const id = `${collection}.${path}`;
  const expression = isExpression(content);

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
        id,
        type: FieldType.DEFAULT,
        color: getColor(id),
        status: [],
      },
      state.collections[collection].fields,
    );
  }

  state.result = assocPath(
    path.split('.'),
    {
      id,
      type: FieldType.DEFAULT,
      color: getColor(id),
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
};
