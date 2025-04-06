import type { Aggregation } from '@/types/aggregation.ts';
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

const createCollection = (res: AnalysisResult, name: string) => {
  if (res.collections[name]) return;
  const id = `${name}._id`;

  res.collections[name] = {
    fields: {
      _id: {
        id,
        type: FieldType.DEFAULT,
        color: getColor(id),
      },
    },
  };
};

export const isFieldResult = (v: Fields | FieldResult): v is FieldResult =>
  'type' in v;

export const analyze = (aggregation: Aggregation) =>
  aggregation.reduce<AnalysisResult>(
    (acc, stage) => {
      createCollection(acc, DEFAULT_COLLECTION);

      if ('$addFields' in stage)
        analyzeAddField(acc, DEFAULT_COLLECTION, stage);

      if ('$unset' in stage) analyzeUnset(acc, DEFAULT_COLLECTION, stage);

      return acc;
    },
    {
      collections: {},
      result: {
        _id: {
          id: `${DEFAULT_COLLECTION}._id`,
          type: FieldType.DEFAULT,
          color: getColor(`${DEFAULT_COLLECTION}._id`),
        },
      },
    },
  );
