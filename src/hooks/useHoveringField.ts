import constate from 'constate';
import { useState } from 'react';
import type { FieldId } from '../utils/analyze';

export const [HoveringFieldProvider, useHoveringField] = constate(() => {
  const [hoveringId, setHoveringId] = useState<FieldId | null>(null);
  return { hoveringId, setHoveringId };
});
