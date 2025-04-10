import type { Aggregation, Stage } from '@/types/aggregation.ts';
import { addFieldsStage } from '@/utils/analyze/stages/addFields.ts';
import { projectionStage } from '@/utils/analyze/stages/projection.ts';
import { setStage } from '@/utils/analyze/stages/set.ts';
import { unsetStage } from '@/utils/analyze/stages/unset.ts';
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
  OBJECT_ID = 'OBJECT_ID',
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
      }
    | { type: ValueType.OBJECT_ID };
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
  states?: State[];
  stage: S;
}) => State;

export const getBaseState = (): State => ({
  collections: {
    [DEFAULT_COLLECTION]: {
      fields: {
        _id: {
          _type: FIELD_SYMBOL,
          id: {
            collection: DEFAULT_COLLECTION,
            path: '_id',
          },
          value: {
            type: ValueType.OBJECT_ID,
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
        value: {
          type: ValueType.OBJECT_ID,
        },
      },
    },
  ],
});

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

      if ('$unset' in stage) {
        states.push(unsetStage({ ...arg, stage }));
      }

      if ('$addFields' in stage) {
        states.push(addFieldsStage({ ...arg, stage }));
      }

      if ('$project' in stage) {
        states.push(projectionStage({ ...arg, stage }));
      }

      return states;
    },
    [getBaseState()],
  );
