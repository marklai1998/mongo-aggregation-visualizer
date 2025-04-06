import './App.css';
import { Editor } from '@/components/Editor.tsx';
import { ColorModeButton } from '@/components/ui/color-mode.tsx';
import { Provider } from '@/components/ui/provider';
import type { Aggregation } from '@/types/aggregation.ts';
import { analysis } from '@/utils/analysis.ts';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

function App() {
  const [value, setValue] = useState<Aggregation>([]);

  useMemo(() => {
    console.log(JSON.stringify(analysis(value)));
  }, [value]);

  return (
    <Provider>
      <VStack h="svh" w="full" gap={0}>
        <HStack borderBottomWidth={1} w="full" p={1}>
          <Box w="full">Mongo Aggregation Visualizer</Box>
          <ColorModeButton />
        </HStack>
        <HStack w="full" h="full" flex={1} alignItems="start">
          <Box h="full" w="40%">
            <Editor onChange={setValue} />
          </Box>
          <Box>test</Box>
        </HStack>
      </VStack>
    </Provider>
  );
}

export default App;
