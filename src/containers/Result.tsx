import { Document } from '@/components/Document.tsx';
import type { AnalysisResult } from '@/utils/analyze';

type Props = {
  state: AnalysisResult;
};

export const Result = ({ state }: Props) => {
  return (
    <div>
      <Document document={state.result} />
    </div>
  );
};
