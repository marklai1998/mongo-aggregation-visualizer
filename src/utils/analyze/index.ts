import type { Aggregation, Stage } from '@/types/aggregation.ts';
import { analyzeAddField } from '@/utils/analyze/addField.ts';
import { analyzeUnset } from '@/utils/analyze/unset.ts';
import { getColor } from '@/utils/getColor.ts';

const DEFAULT_COLLECTION = 'Source';

export enum FieldType {
  DEFAULT = 'DEFAULT',
}

export type FieldResult = {
  id: string;
  type: FieldType;
  color: string;
  valueLiteral?: string;
};

export type Fields = {
  [fieldName: string]: FieldResult | Fields;
};

export type AnalysisResult = {
  collections: {
    [collectionName: string]: {
      fields: Fields;
    };
  };
  result: {
    [fieldName: string]: FieldResult;
  };
};

export type StageAnalyzer<S extends Stage> = (arg: {
  state: AnalysisResult;
  collection: string;
  stage: S;
}) => void;

export const isFieldResult = (v: Fields | FieldResult): v is FieldResult =>
  'type' in v;

export const analyze = (aggregation: Aggregation) =>
  aggregation.reduce<AnalysisResult>(
    (state, stage) => {
      const arg = { state, collection: DEFAULT_COLLECTION };

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
            },
          },
        },
      },
      result: {
        _id: {
          id: `${DEFAULT_COLLECTION}._id`,
          type: FieldType.DEFAULT,
          color: getColor(`${DEFAULT_COLLECTION}._id`),
        },
      },
    },
  );
