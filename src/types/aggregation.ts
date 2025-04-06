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

export const project = Type.Object({
  $project: Type.Recursive((This) =>
    Type.Mapped(Type.String({ minLength: 1 }), () =>
      Type.Union([
        Type.Literal(0),
        Type.Literal(1),
        Type.Literal(true),
        Type.Literal(false),
        Type.String(), // Treat as true
        This,
      ]),
    ),
  ),
});

export const stage = Type.Union([addField, unset, set, project]);

export const aggregation = Type.Array(stage);

export type Aggregation = Static<typeof aggregation>;
export type Stage = Static<typeof stage>;
export type AddField = Static<typeof addField>;
export type Unset = Static<typeof unset>;
export type Set = Static<typeof set>;
export type Project = Static<typeof project>;
