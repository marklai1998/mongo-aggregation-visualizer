import type { Unset } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/newAnalyze';
import { resolveField } from '@/utils/newAnalyze/resolveField.ts';
import { clone, dissocPath } from 'ramda';

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
