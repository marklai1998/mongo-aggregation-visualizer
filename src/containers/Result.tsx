import type { AnalysisResult } from '@/utils/analyze';
import { Card } from '@chakra-ui/react';

export type Props = {
  state: AnalysisResult;
};

export const Result = (_props: Props) => {
  return (
    <div>
      <Card.Root size="sm">
        <Card.Body>TODO</Card.Body>
      </Card.Root>
    </div>
  );
};
