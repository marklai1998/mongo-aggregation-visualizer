import type { Project } from '@/types/aggregation.ts';
import {
  FIELD_SYMBOL,
  FieldType,
  type StageAnalyzer,
  type State,
} from '@/utils/analyze';
import { isExpression, isTmpField } from '@/utils/analyze/analyzeUtil.ts';
import { assocPath, clone, dissocPath } from 'ramda';

export const projectRecursive = ({
  state,
  collection,
  stage,
  baseKey,
  idx,
}: {
  state: State;
  collection: string;
  stage: Project['$project'];
  baseKey?: string;
  idx: number;
}): State =>
  Object.entries(stage).reduce((state, [key, content]) => {
    if (content === null || content === undefined) return state;

    const path = baseKey ? `${baseKey}.${key}` : key;

    if (typeof content === 'object' && !isExpression(content)) {
      return projectRecursive({
        state,
        collection,
        stage: content,
        baseKey: path,
        idx,
      });
    }

    if (content) {
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
            _type: FIELD_SYMBOL,
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
            _type: FIELD_SYMBOL,
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

      return state;
    }

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
          _type: FIELD_SYMBOL,
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

    return state;
  }, clone(state));

export const analyzeProject: StageAnalyzer<Project> = ({
  state,
  collection,
  stage: { $project: stage },
  idx,
}) => projectRecursive({ state, collection, stage, idx });
