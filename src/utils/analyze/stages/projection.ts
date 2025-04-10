import type { Project } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '..';

import { isField } from '@/utils/analyze/analyzeUtil.ts';
import { resolveField } from '@/utils/analyze/resolveField.ts';
import { unsetStage } from '@/utils/analyze/stages/unset.ts';
import { recursive } from '@/utils/recursive.ts';
import { flatten } from 'flat';
import {
  assocPath,
  clone,
  dissocPath,
  omit,
  path as pathFn,
  range,
  slice,
  tail,
} from 'ramda';

export const projectionStage: StageAnalyzer<Project> = ({
  state: prevState,
  states = [],
  stage: { $project: stage },
}) => {
  const state = clone(prevState);

  const flattedStage = flatten<object, { _id?: number }>(stage);
  if (Object.values(omit(['_id'], flattedStage)).some((v) => !v)) {
    // Exclusion mode take the priority
    // https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#syntax

    return unsetStage({
      state,
      states,
      stage: {
        $unset: Object.entries(flattedStage)
          .filter(([, v]) => !v)
          .map(([k]) => k),
      },
    });
  }

  recursive({
    object: stage,
    callback: ({ value, path }) => {
      if (!value) {
        if (path === '_id') {
          state.results = state.results.map(dissocPath(path.split('.')));
        }
        return;
      }

      const resolvedField = resolveField({
        prevStates: states,
        path,
        state,
        setSrc: true,
      });

      state.results = state.results.map((result) => {
        let clonedResult = clone(result);

        const splittedPath = path.split('.');
        const paths = range(0, splittedPath.length)
          .map((i) => slice(0, i + 1, splittedPath))
          .reverse();

        for (const p of tail(paths)) {
          const item = pathFn(p, result);
          if (isField(item)) {
            clonedResult = dissocPath(p, result);
          }
        }

        return assocPath(path.split('.'), resolvedField, clonedResult);
      });
    },
  });

  return state;
};
