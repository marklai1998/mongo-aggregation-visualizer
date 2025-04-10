import { setStage } from '@/utils/analyze/stages/set.ts';
import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  TMP_COLLECTION,
  ValueType,
  getBaseState,
} from '../..';

describe('set', () => {
  it('set field', () => {
    const result = setStage({
      state: getBaseState(),
      stage: {
        $set: {
          a: '1',
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
              collection: 'Source',
              path: '_id',
            },
            value: {
              type: ValueType.OBJECT_ID,
            },
          },
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: TMP_COLLECTION,
              path: 'a',
            },
            value: {
              type: ValueType.STRING,
              value: '1',
            },
          },
        },
      ],
    });
  });

  it('set nested field', () => {
    const result = setStage({
      state: getBaseState(),
      stage: {
        $set: {
          a: {
            b: '1',
            c: '2',
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
                collection: 'Source',
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
              collection: 'Source',
              path: '_id',
            },
            value: {
              type: ValueType.OBJECT_ID,
            },
          },
          a: {
            b: {
              _type: FIELD_SYMBOL,
              id: {
                collection: TMP_COLLECTION,
                path: 'a.b',
              },
              value: {
                type: ValueType.STRING,
                value: '1',
              },
            },
            c: {
              _type: FIELD_SYMBOL,
              id: {
                collection: TMP_COLLECTION,
                path: 'a.c',
              },
              value: {
                type: ValueType.STRING,
                value: '2',
              },
            },
          },
        },
      ],
    });
  });

  it('ignore prev value', () => {
    const result = setStage({
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
                value: {
                  type: ValueType.OBJECT_ID,
                },
              },
            },
          },
          Test: {
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
              a: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: 'Test',
                  path: 'a',
                },
                value: {
                  type: ValueType.STRING,
                  value: '1',
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
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: 'Test',
                path: 'a',
              },
              value: {
                type: ValueType.STRING,
                value: '1',
              },
            },
          },
        ],
      },
      stage: {
        $set: {
          a: '2',
        },
      },
    });

    expect(result).toStrictEqual({
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
        Test: {
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
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: 'Test',
                path: 'a',
              },
              value: {
                type: ValueType.STRING,
                value: '1',
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
            value: {
              type: ValueType.OBJECT_ID,
            },
          },
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: TMP_COLLECTION,
              path: 'a',
            },
            value: {
              type: ValueType.STRING,
              value: '2',
            },
          },
        },
      ],
    });
  });

  it('resolve reference', () => {
    const result = setStage({
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
      },
      stage: {
        $set: {
          a: '$b',
        },
      },
    });

    expect(result).toStrictEqual({
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
            b: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'b',
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
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: DEFAULT_COLLECTION,
              path: 'b',
            },
          },
        },
      ],
    });
  });

  it('should not reference old field', () => {
    const result = setStage({
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
                value: {
                  type: ValueType.OBJECT_ID,
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
                collection: DEFAULT_COLLECTION,
                path: '_id',
              },
              value: {
                type: ValueType.OBJECT_ID,
              },
            },
          },
        ],
      },
      stage: {
        $set: {
          a: '1',
        },
      },
    });

    expect(result).toStrictEqual({
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
              collection: DEFAULT_COLLECTION,
              path: '_id',
            },
            value: {
              type: ValueType.OBJECT_ID,
            },
          },
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: TMP_COLLECTION,
              path: 'a',
            },
            value: {
              type: ValueType.STRING,
              value: '1',
            },
          },
        },
      ],
    });
  });
});
