import type { Set as SetStage } from '@/types/aggregation.ts';
import { addFieldRecursive } from '@/utils/oldAnalyze/stageAnalyzer/addField.ts';
import type { StageAnalyzer } from '..';

export const analyzeSet: StageAnalyzer<SetStage> = ({
  state,
  collection,
  stage: { $set: stage },
}) => addFieldRecursive(state, collection, stage);
