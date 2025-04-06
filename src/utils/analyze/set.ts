import type { Set as SetStage } from '@/types/aggregation.ts';
import { addFieldRecursive } from '@/utils/analyze/addField.ts';
import type { StageAnalyzer } from '@/utils/analyze/index.ts';

export const analyzeSet: StageAnalyzer<SetStage> = ({
  state,
  collection,
  stage,
}) => {
  const content = stage.$set;
  addFieldRecursive(state, collection, content);
};
