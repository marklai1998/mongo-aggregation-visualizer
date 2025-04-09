import type { Aggregation, Stage } from '@/types/aggregation.ts';
import { analyzeAddField } from '@/utils/oldAnalyze/stageAnalyzer/addField.ts';
import { analyzeProject } from '@/utils/oldAnalyze/stageAnalyzer/project.ts';
import { analyzeSet } from '@/utils/oldAnalyze/stageAnalyzer/set.ts';
import { analyzeUnset } from '@/utils/oldAnalyze/stageAnalyzer/unset.ts';
import { last } from 'ramda';

export const DEFAULT_COLLECTION = 'Source';
export const TMP_COLLECTION = Symbol('TMP');
export const FIELD_SYMBOL = Symbol('FIELD');
export enum FieldType {
  DEFAULT = 'DEFAULT',
}

export type FieldState =
  | {
      isUnseted: boolean;
      step: number;
    }
  | {
      isExpression: boolean;
      expression: string;
    };

export type FieldId = {
  collection: string | symbol;
  path: string;
};

export type Field = {
  _type: typeof FIELD_SYMBOL;
  id: FieldId;
  type: FieldType;
  valueLiteral?: string;
  status: FieldState[];
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
  result: Document;
};

export type StageAnalyzer<S extends Stage> = (arg: {
  state: State;
  collection: string;
  stage: S;
  idx: number;
}) => State;

export const analyze = (aggregation: Aggregation) =>
  aggregation.reduce<[State]>(
    (states, stage, idx) => {
      const arg = {
        states,
        state: last(states),
        collection: DEFAULT_COLLECTION,
        idx,
      };

      if ('$addFields' in stage) {
        states.push(analyzeAddField({ ...arg, stage }));
      }
      if ('$set' in stage) {
        states.push(analyzeSet({ ...arg, stage }));
      }
      if ('$unset' in stage) {
        states.push(analyzeUnset({ ...arg, stage }));
      }
      if ('$project' in stage) {
        states.push(analyzeProject({ ...arg, stage }));
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
                type: FieldType.DEFAULT,
                status: [],
              },
            },
          },
        },
        result: {
          _id: {
            _type: FIELD_SYMBOL,
            id: {
              collection: DEFAULT_COLLECTION,
              path: '_id',
            },
            type: FieldType.DEFAULT,
            status: [],
          },
        },
      },
    ],
  );
