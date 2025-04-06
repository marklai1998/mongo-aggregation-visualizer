import './App.css';
import { Editor } from '@/components/Editor.tsx';
import { ColorModeButton } from '@/components/ui/color-mode.tsx';
import { Provider } from '@/components/ui/provider';
import { Collections } from '@/containers/Collections.tsx';
import { Result } from '@/containers/Result.tsx';
import type { Aggregation } from '@/types/aggregation.ts';
import { analyze } from '@/utils/analyze';
import { Box, HStack, Heading, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

function App() {
  const [value, setValue] = useState<Aggregation>([]);

  const state = useMemo(() => {
    const res = analyze(value);
    console.dir(res);
    return res;
  }, [value]);

  return (
    <Provider>
      <VStack h="svh" w="full" gap={0}>
        <HStack borderBottomWidth={1} w="full" p={1}>
          <Box w="full">Mongo Aggregation Visualizer</Box>
          <ColorModeButton />
        </HStack>
        <HStack w="full" h="full" flex={1} alignItems="start" gap={0}>
          <Box h="full" w="500px" flexShrink={0} borderRightWidth={1}>
            <Editor onChange={setValue} />
          </Box>
          <HStack overflow="auto" h="full" alignItems="start">
            <Box w="500px" flexShrink="0" px="6" py="4">
              <Heading mb="4">Collections</Heading>
              <Collections state={state} />
            </Box>
            <Box w="500px" flexShrink="0" px="6" py="4">
              <Heading mb="4">Result</Heading>
              <Result state={state} />
            </Box>
          </HStack>
        </HStack>
      </VStack>
    </Provider>
  );
}

export default App;
