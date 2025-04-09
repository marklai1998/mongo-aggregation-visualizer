import type { Unset } from '@/types/aggregation.ts';
import { resolveField } from '@/utils/analyze/resolveField.ts';
import { clone, dissocPath } from 'ramda';
import type { StageAnalyzer } from '..';

export const unsetStage: StageAnalyzer<Unset> = ({
  state: prevState,
  stage: { $unset: stage },
}) => {
  const state = clone(prevState);

  for (const path of typeof stage === 'string' ? [stage] : stage) {
    resolveField({ prevState, state, path, setSrc: true });

    state.results = state.results.map(dissocPath(path.split('.')));
  }

  return state;
};
