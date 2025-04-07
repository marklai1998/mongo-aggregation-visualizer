import type { FieldId } from '@/utils/analyze';
import constate from 'constate';
import { useState } from 'react';

export const [HoveringFieldProvider, useHoveringField] = constate(() => {
  const [hoveringId, setHoveringId] = useState<FieldId | null>(null);
  return { hoveringId, setHoveringId };
});
