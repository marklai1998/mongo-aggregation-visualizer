import type { Aggregation, Stage } from '@/types/aggregation.ts';
import { setStage } from '@/utils/newAnalyze/stages/set.ts';
import { clone, last } from 'ramda';

export const DEFAULT_COLLECTION = 'Source';
export const TMP_COLLECTION = Symbol('TMP');
export const FIELD_SYMBOL = Symbol('FIELD');

export type FieldId = {
  collection: string | typeof TMP_COLLECTION;
  path: string;
};

export enum ValueType {
  STRING = 'STRING',
  EXPRESSION = 'EXPRESSION',
}

export type Field = {
  _type: typeof FIELD_SYMBOL;
  id: FieldId;
  value?:
    | {
        type: ValueType.STRING;
        value: string;
      }
    | {
        type: ValueType.EXPRESSION;
        expression: unknown;
      };
};

export type Document = {
  [fieldName: string]: Field | Document;
};

export type State = {
  collections: {
    [collectionName: string]: {
      fields: Document;
    };
  };
  results: Document[];
};

export type StageAnalyzer<S extends Stage> = (arg: {
  state: State;
  collection: string;
  stage: S;
}) => State;

export const analyze = (aggregation: Aggregation) =>
  aggregation.reduce<[State]>(
    (states, stage, idx) => {
      const arg = {
        states,
        state: clone(last(states)),
        collection: DEFAULT_COLLECTION,
        idx,
      };

      if ('$set' in stage) {
        states.push(setStage({ ...arg, stage }));
      }

      return states;
    },
    [
      {
        collections: {
          [DEFAULT_COLLECTION]: {
            fields: {
              _id: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: '_id',
                },
              },
            },
          },
        },
        results: [
          {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: '_id',
              },
            },
          },
        ],
      },
    ],
  );
