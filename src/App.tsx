import { Editor } from '@/components/Editor.tsx';
import { ColorModeButton } from '@/components/ui/color-mode.tsx';
import { Collections } from '@/containers/Collections.tsx';
import { Result } from '@/containers/Result.tsx';
import type { Aggregation } from '@/types/aggregation.ts';
import { Box, HStack, Heading, VStack } from '@chakra-ui/react';
import { last } from 'ramda';
import { useMemo, useState } from 'react';
import { analyze } from './utils/analyze';

export const App = () => {
  const [value, setValue] = useState<Aggregation>([]);

  const state = useMemo(() => {
    const res = analyze(value);
    console.dir(res);
    return last(res);
  }, [value]);

  return (
    <VStack h="svh" w="full" gap={0}>
      <HStack borderBottomWidth={1} w="full" p={1}>
        <Box w="full" px="2">
          Mongo Aggregation Visualizer
        </Box>
        <ColorModeButton />
      </HStack>
      <HStack w="full" h="full" flex={1} alignItems="start" gap="0">
        <Box h="full" w="500px" flexShrink={0} borderRightWidth={1}>
          <Editor onChange={setValue} />
        </Box>
        <HStack
          overflow="auto"
          h="full"
          alignItems="start"
          gap="8"
          px="8"
          py="6"
        >
          <Box minW="500px" flexShrink="0">
            <Heading mb="4">Collections</Heading>
            <Collections state={state} />
          </Box>
          <Box minW="500px" flexShrink="0">
            <Heading mb="4">Result</Heading>
            <Result state={state} />
          </Box>
        </HStack>
      </HStack>
    </VStack>
  );
};
