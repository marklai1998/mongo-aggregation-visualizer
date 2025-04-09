import type { AddFields } from '@/types/aggregation.ts';
import type { StageAnalyzer } from '@/utils/newAnalyze';
import { setStage } from '@/utils/newAnalyze/stages/set.ts';

export const addFieldsStage: StageAnalyzer<AddFields> = ({
  state,
  stage: { $addFields: stage },
}) => setStage({ state, stage: { $set: stage } });
