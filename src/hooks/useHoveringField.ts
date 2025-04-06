import constate from 'constate';
import { useState } from 'react';

export const [HoveringFieldProvider, useHoveringField] = constate(() => {
  const [hoveringId, setHoveringId] = useState<string | null>(null);
  return { hoveringId, setHoveringId };
});
