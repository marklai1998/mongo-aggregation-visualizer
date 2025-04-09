import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  getBaseState,
} from '@/utils/newAnalyze';
import { ValueType } from '@/utils/newAnalyze';
import { setStage } from '@/utils/newAnalyze/stages/set.ts';

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
            },
            a: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
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
          },
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: DEFAULT_COLLECTION,
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
            },
            a: {
              b: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
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
                  collection: DEFAULT_COLLECTION,
                  path: 'a.c',
                },
                value: {
                  type: ValueType.STRING,
                  value: '2',
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
              value: {
                type: ValueType.STRING,
                value: '1',
              },
            },
            c: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
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

  it('grep prev value', () => {
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
          },
          a: {
            _type: FIELD_SYMBOL,
            id: {
              collection: 'Test',
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
});
