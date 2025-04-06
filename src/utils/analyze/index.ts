import type { Aggregation, Stage } from '@/types/aggregation.ts';
import { analyzeAddField } from '@/utils/analyze/addField.ts';
import { analyzeUnset } from '@/utils/analyze/unset.ts';
import { getColor } from '@/utils/getColor.ts';

const DEFAULT_COLLECTION = 'Source';

export enum FieldType {
  DEFAULT = 'DEFAULT',
}

export type FieldState = {
  isUnseted: boolean;
  step: number;
};

export type Field = {
  id: string;
  type: FieldType;
  color: string;
  valueLiteral?: string;
  status: FieldState[];
};

export type Document = {
  [fieldName: string]: Field | Document;
};

export type AnalysisResult = {
  collections: {
    [collectionName: string]: {
      fields: Document;
    };
  };
  result: Document;
};

export type StageAnalyzer<S extends Stage> = (arg: {
  state: AnalysisResult;
  collection: string;
  stage: S;
  idx: number;
}) => void;

export const isFieldResult = (v: Document | Field): v is Field => 'type' in v;

export const analyze = (aggregation: Aggregation) =>
  aggregation.reduce<AnalysisResult>(
    (state, stage, idx) => {
      const arg = { state, collection: DEFAULT_COLLECTION, idx };

      if ('$addFields' in stage) analyzeAddField({ ...arg, stage });
      if ('$unset' in stage) analyzeUnset({ ...arg, stage });

      return state;
    },
    {
      collections: {
        [DEFAULT_COLLECTION]: {
          fields: {
            _id: {
              id: `${DEFAULT_COLLECTION}._id`,
              type: FieldType.DEFAULT,
              color: getColor(`${DEFAULT_COLLECTION}._id`),
              status: [],
            },
          },
        },
      },
      result: {
        _id: {
          id: `${DEFAULT_COLLECTION}._id`,
          type: FieldType.DEFAULT,
          color: getColor(`${DEFAULT_COLLECTION}._id`),
          status: [],
        },
      },
    },
  );
