import './App.css';
import { Editor } from '@/components/Editor.tsx';
import { ColorModeButton } from '@/components/ui/color-mode.tsx';
import { Provider } from '@/components/ui/provider';
import type { Aggregation } from '@/types/aggregation.ts';
import { analyze } from '@/utils/analyze';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

function App() {
  const [value, setValue] = useState<Aggregation>([]);

  useMemo(() => {
    console.log(JSON.stringify(analyze(value)));
  }, [value]);

  return (
    <Provider>
      <VStack h="svh" w="full" gap={0}>
        <HStack borderBottomWidth={1} w="full" p={1}>
          <Box w="full">Mongo Aggregation Visualizer</Box>
          <ColorModeButton />
        </HStack>
        <HStack w="full" h="full" flex={1} alignItems="start" gap={0}>
          <Box h="full" w="500px" flexShrink={0}>
            <Editor onChange={setValue} />
          </Box>
          <HStack overflow="auto" h="full" alignItems="start">
            <Box w="500px" flexShrink="0">
              Collections
            </Box>
            <Box w="500px" flexShrink="0">
              Result
            </Box>
          </HStack>
        </HStack>
      </VStack>
    </Provider>
  );
}

export default App;
