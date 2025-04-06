import type { Aggregation } from '@/types/aggregation.ts';

const DEFAULT_COLLECTION = 'Source';

enum FieldType {
  DEFAULT = 'DEFAULT',
}

type AnalysisResult = {
  collection: {
    [collectionName: string]: {
      fields: {
        [fieldName: string]: {
          type: FieldType;
        };
      };
    };
  };
};

const createCollection = (res: AnalysisResult, name: string) => {
  if (res.collection[name]) return;
  res.collection[name] = {
    fields: {},
  };
};

export const analysis = (aggregation: Aggregation) =>
  aggregation.reduce<AnalysisResult>(
    (acc, stage) => {
      if ('$addFields' in stage) {
        const content = stage.$addFields;

        const keys = Object.keys(content);
        console.log(content);
        createCollection(acc, DEFAULT_COLLECTION);
        for (const key of keys) {
          acc.collection[DEFAULT_COLLECTION].fields[String(key)] = {
            type: FieldType.DEFAULT,
          };
        }
      }

      if ('$unset' in stage) {
      }

      return acc;
    },
    { collection: {} },
  );
