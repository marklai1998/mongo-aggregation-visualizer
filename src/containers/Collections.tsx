import { Document } from '@/components/Document.tsx';
import type { State } from '@/utils/analyze';
import { Box } from '@chakra-ui/react';

type Props = {
  state: State;
};

export const Collections = ({ state: { collections } }: Props) => {
  return (
    <div>
      {Object.entries(collections).map(([name, { fields }]) => (
        <Box key={name}>
          <Box
            bg="bg.muted"
            borderRadius="md"
            fontSize="sm"
            padding="3"
            mb="4"
            fontWeight="semibold"
          >
            {name}
          </Box>
          <Document document={fields} />
        </Box>
      ))}
    </div>
  );
};
