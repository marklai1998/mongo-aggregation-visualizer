import type { Aggregation, Stage } from '@/types/aggregation.ts';
import { analyzeAddField } from '@/utils/analyze/stageAnalyzer/addField.ts';
import { analyzeProject } from '@/utils/analyze/stageAnalyzer/project.ts';
import { analyzeSet } from '@/utils/analyze/stageAnalyzer/set.ts';
import { analyzeUnset } from '@/utils/analyze/stageAnalyzer/unset.ts';
import { clone, last } from 'ramda';

export const DEFAULT_COLLECTION = 'Source';
export const TMP_COLLECTION = Symbol('TMP');

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
  id: FieldId;
  type: FieldType;
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

export const analyze = (aggregation: Aggregation) =>
  aggregation.reduce<[AnalysisResult]>(
    (state, stage, idx) => {
      const lastState = clone(last(state));

      const arg = { state: lastState, collection: DEFAULT_COLLECTION, idx };

      if ('$addFields' in stage) analyzeAddField({ ...arg, stage });
      if ('$set' in stage) analyzeSet({ ...arg, stage });
      if ('$unset' in stage) analyzeUnset({ ...arg, stage });
      if ('$project' in stage) analyzeProject({ ...arg, stage });

      state.push(lastState);
      return state;
    },
    [
      {
        collections: {
          [DEFAULT_COLLECTION]: {
            fields: {
              _id: {
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
