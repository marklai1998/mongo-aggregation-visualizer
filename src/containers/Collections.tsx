import { Document } from '@/components/Document.tsx';
import type { AnalysisResult } from '@/utils/analyze';
import { Box } from '@chakra-ui/react';

type Props = {
  state: AnalysisResult;
};

export const Collections = ({ state: { collections } }: Props) => {
  return (
    <div>
      {Object.entries(collections).map(([name, { fields }]) => (
        <Box key={name}>
          <Box bg="bg.muted" borderRadius="md" fontSize="sm" padding="3" mb="4">
            {name}
          </Box>
          <Document document={fields} />
        </Box>
      ))}
    </div>
  );
};
