import { type Static, Type } from '@sinclair/typebox';

export const unset = Type.Object({
  $unset: Type.Union([Type.String(), Type.Array(Type.String())]),
});

export const addField = Type.Object({
  $addFields: Type.Mapped(Type.String(), () => Type.Unknown()),
});

export const stage = Type.Union([addField, unset]);

export const aggregation = Type.Array(stage);

export type Aggregation = Static<typeof aggregation>;
