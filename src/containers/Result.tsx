import { Document } from '@/components/Document.tsx';
import type { State } from '@/utils/newAnalyze';

type Props = {
  state: State;
};

export const Result = ({ state }: Props) => {
  return (
    <div>
      {state.results.map((document, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: does not matter
        <Document document={document} key={idx} />
      ))}
    </div>
  );
};
