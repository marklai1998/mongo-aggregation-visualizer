import type { Unset } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/newAnalyze';
import { resolveField } from '@/utils/newAnalyze/resolveField.ts';
import { clone, dissocPath } from 'ramda';

export const unsetStage: StageAnalyzer<Unset> = ({
  state: prevState,
  stage: { $unset: stage },
}) =>
  (typeof stage === 'string' ? [stage] : stage).reduce((state, path) => {
    resolveField({ prevState, state, path, setResult: false, setSrc: true });

    state.results = state.results.map(dissocPath(path.split('.')));

    return state;
  }, clone(prevState));
