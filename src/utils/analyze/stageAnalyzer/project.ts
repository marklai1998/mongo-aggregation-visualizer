import type { Project } from '@/types/aggregation.ts';
import {
  FIELD_SYMBOL,
  FieldType,
  type StageAnalyzer,
  type State,
} from '@/utils/analyze';
import { isExpression, isTmpField } from '@/utils/analyze/analyzeUtil.ts';
import { analyzeUnset } from '@/utils/analyze/stageAnalyzer/unset.ts';
import { flatten } from 'flat';
import {
  assocPath,
  clone,
  dissocPath,
  omit,
  path as pathFn,
  pick,
} from 'ramda';

type ExtendedState = State & { newResult: State['result'] };

export const projectRecursive = ({
  state,
  collection,
  stage,
  baseKey,
  idx,
}: {
  state: ExtendedState;
  collection: string;
  stage: Project['$project'];
  baseKey?: string;
  idx: number;
}): ExtendedState =>
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

      if (
        !isTmpField({
          state,
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
            status: [],
          },
          state.collections[collection].fields,
        );
      }

      state.newResult = assocPath(
        path.split('.'),
        pathFn(path.split('.'), state.result) ?? {
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
        state.newResult,
      );

      return state;
    }

    if (key === '_id') {
      state.newResult = dissocPath(key.split('.'), state.newResult);
    }

    return state;
  }, clone(state));

export const analyzeProject: StageAnalyzer<Project> = ({
  state,
  collection,
  stage: { $project: stage },
  idx,
}) => {
  const flattedStage = flatten<object, { _id?: number }>(stage);

  if (Object.values(omit(['_id'], flattedStage)).some((v) => !v)) {
    // Exclusion mode take the priority
    // https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#syntax

    return analyzeUnset({
      state,
      collection,
      stage: {
        $unset: Object.entries(flattedStage)
          .filter(([, v]) => !v)
          .map(([k]) => k),
      },
      idx,
    });
  }

  const newState = projectRecursive({
    state: {
      ...state,
      newResult: pick(['_id'], state.result),
    },
    collection,
    stage,
    idx,
  });

  newState.result = newState.newResult;

  return omit(['newResult'], newState);
};
