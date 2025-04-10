import { unsetStage } from '@/utils/analyze/stages/unset.ts';
import {
  DEFAULT_COLLECTION,
  FIELD_SYMBOL,
  ValueType,
  getBaseState,
} from '../..';

describe('unset', () => {
  it('unset field', () => {
    const result = unsetStage({
      state: getBaseState(),
      stage: {
        $unset: 'a',
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
            value: {
              type: ValueType.OBJECT_ID,
            },
          },
        },
      ],
    });
  });

  it('unset nested field', () => {
    const result = unsetStage({
      state: getBaseState(),
      stage: {
        $unset: 'a.b',
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
            value: {
              type: ValueType.OBJECT_ID,
            },
          },
        },
      ],
    });
  });

  it('not add field if item is prev set', () => {
    const result = unsetStage({
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
              x: {
                _type: FIELD_SYMBOL,
                id: {
                  collection: DEFAULT_COLLECTION,
                  path: 'x',
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
                collection: DEFAULT_COLLECTION,
                path: 'x',
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
        $unset: 'a',
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
            x: {
              _type: FIELD_SYMBOL,
              id: {
                collection: DEFAULT_COLLECTION,
                path: 'x',
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
        },
      ],
    });
  });
});
