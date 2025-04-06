import { type Static, Type } from '@sinclair/typebox';

export const unset = Type.Object({
  $unset: Type.Union([
    Type.String({ minLength: 1 }),
    Type.Array(Type.String({ minLength: 1 })),
  ]),
});

export const addField = Type.Object({
  $addFields: Type.Recursive((This) =>
    Type.Mapped(Type.String({ minLength: 1 }), () =>
      Type.Union([Type.String(), This]),
    ),
  ),
});
export const set = Type.Object({
  $set: Type.Recursive((This) =>
    Type.Mapped(Type.String({ minLength: 1 }), () =>
      Type.Union([Type.String(), This]),
    ),
  ),
});

export const stage = Type.Union([addField, unset, set]);

export const aggregation = Type.Array(stage);

export type Aggregation = Static<typeof aggregation>;
export type Stage = Static<typeof stage>;
export type AddField = Static<typeof addField>;
export type Unset = Static<typeof unset>;
export type Set = Static<typeof set>;
