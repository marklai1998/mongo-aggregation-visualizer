import type { Set as SetStage } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/newAnalyze';
import { resolveField } from '@/utils/newAnalyze/resolveField.ts';
import { recursive } from '@/utils/recursive.ts';
import { clone } from 'ramda';

export const setStage: StageAnalyzer<SetStage> = ({
  state: prevState,
  stage: { $set: stage },
}) => {
  const state = clone(prevState);

  recursive({
    object: stage,
    callback: ({ value, path }) => {
      resolveField({ prevState, path, state, value });
    },
  });

  return state;
};
