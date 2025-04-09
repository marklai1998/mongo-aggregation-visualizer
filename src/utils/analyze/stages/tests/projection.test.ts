import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  getBaseState,
} from '@/utils/analyze';
import { projectionStage } from '@/utils/analyze/stages/projection.ts';

describe('projection', () => {
  it('project field', () => {
    const result = projectionStage({
      state: getBaseState(),
      stage: {
        $project: {
          a: 1,
        },
      },
    });

    expect(result).toStrictEqual({
      collections: {
        Source: {
          fields: {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: 'Source',
                path: '_id',
              },
            },
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a',
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
              collection: 'Source',
              path: '_id',
            },
          },
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: DEFAULT_COLLECTION,
              path: 'a',
            },
          },
        },
      ],
    });
  });

  it('project field with id unset', () => {
    const result = projectionStage({
      state: getBaseState(),
      stage: {
        $project: {
          _id: 0,
          a: 1,
        },
      },
    });

    expect(result).toStrictEqual({
      collections: {
        Source: {
          fields: {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: 'Source',
                path: '_id',
              },
            },
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a',
              },
            },
          },
        },
      },
      results: [
        {
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: DEFAULT_COLLECTION,
              path: 'a',
            },
          },
        },
      ],
    });
  });

  it('project nested field', () => {
    const result = projectionStage({
      state: {
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
              a: {
                b: {
                  _type: FIELD_SYMBOL,
                  id: {
                    collection: DEFAULT_COLLECTION,
                    path: 'a.b',
                  },
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
            a: {
              b: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: 'a.b',
                },
              },
            },
          },
        ],
      },
      stage: {
        $project: {
          a: {
            b: 1,
            c: 1,
          },
        },
      },
    });

    expect(result).toStrictEqual({
      collections: {
        Source: {
          fields: {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: '_id',
              },
            },
            a: {
              b: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: 'a.b',
                },
              },
              c: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: 'a.c',
                },
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
              collection: 'Source',
              path: '_id',
            },
          },
          a: {
            b: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a.b',
              },
            },
            c: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a.c',
              },
            },
          },
        },
      ],
    });
  });

  it('project field on nested parent', () => {
    const result = projectionStage({
      state: {
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
              a: {
                b: {
                  _type: FIELD_SYMBOL,
                  id: {
                    collection: DEFAULT_COLLECTION,
                    path: 'a.b',
                  },
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
            a: {
              b: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: 'a.b',
                },
              },
            },
          },
        ],
      },
      stage: {
        $project: {
          a: 1,
        },
      },
    });

    expect(result).toStrictEqual({
      collections: {
        Source: {
          fields: {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: '_id',
              },
            },
            a: {
              b: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: 'a.b',
                },
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
              collection: 'Source',
              path: '_id',
            },
          },
          a: {
            b: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a.b',
              },
            },
          },
        },
      ],
    });
  });

  it('unset field', () => {
    const result = projectionStage({
      state: getBaseState(),
      stage: {
        $project: {
          a: 0,
        },
      },
    });

    expect(result).toStrictEqual({
      collections: {
        Source: {
          fields: {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: 'Source',
                path: '_id',
              },
            },
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a',
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
              collection: 'Source',
              path: '_id',
            },
          },
        },
      ],
    });
  });

  it('unset field with id unset', () => {
    const result = projectionStage({
      state: getBaseState(),
      stage: {
        $project: {
          _id: 0,
          a: 0,
        },
      },
    });

    expect(result).toStrictEqual({
      collections: {
        Source: {
          fields: {
            _id: {
              _type: FIELD_SYMBOL,
              id: {
                collection: 'Source',
                path: '_id',
              },
            },
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'a',
              },
            },
          },
        },
      },
      results: [{}],
    });
  });
});
