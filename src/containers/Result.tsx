import { Document } from '@/components/Document.tsx';
import type { State } from '@/utils/analyze';

type Props = {
  state: State;
};

export const Result = ({ state }: Props) => {
  return (
    <div>
      <Document document={state.result} />
    </div>
  );
};
