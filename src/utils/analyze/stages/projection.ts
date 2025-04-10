import type { Project } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '..';

import { resolveField } from '@/utils/analyze/resolveField.ts';
import { unsetStage } from '@/utils/analyze/stages/unset.ts';
import { recursive } from '@/utils/recursive.ts';
import { flatten } from 'flat';
import { assocPath, clone, dissocPath, omit } from 'ramda';

export const projectionStage: StageAnalyzer<Project> = ({
  state: prevState,
  states,
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

      state.results = state.results.map(
        assocPath(path.split('.'), resolvedField),
      );
    },
  });

  return state;
};
