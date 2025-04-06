import { type Static, Type } from '@sinclair/typebox';

export const aggregation = Type.Array(Type.Number());

export type Aggregation = Static<typeof aggregation>;
