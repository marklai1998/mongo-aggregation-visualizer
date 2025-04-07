import type { Set as SetStage } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/analyze';
import { addFieldRecursive } from '@/utils/analyze/stageAnalyzer/addField.ts';

export const analyzeSet: StageAnalyzer<SetStage> = ({
  state,
  collection,
  stage: { $set: stage },
}) => {
  addFieldRecursive(state, collection, stage);
};
