import type { AddFields } from '@/types/aggregation.ts';
import { setStage } from '@/utils/analyze/stages/set.ts';
import type { StageAnalyzer } from '..';

export const addFieldsStage: StageAnalyzer<AddFields> = ({
  state,
  stage: { $addFields: stage },
}) => setStage({ state, stage: { $set: stage } });
