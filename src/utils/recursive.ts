import { isExpression } from '@/utils/oldAnalyze/analyzeUtil.ts';

export const recursive = <T extends object>(
  {
    object,
    callback,
  }: { object: T; callback: (arg: { value: unknown; path: string }) => void },
  baseKey?: string,
): void => {
  for (const [key, value] of Object.entries(object)) {
    if (object === null || object === undefined) return;

    const path = baseKey ? `${baseKey}.${key}` : key;

    if (typeof value === 'object' && !isExpression(value)) {
      recursive({ object: value, callback }, path);
      continue;
    }

    callback({ value, path });
  }
};
