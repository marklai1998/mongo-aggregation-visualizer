import { useColorMode } from '@/components/ui/color-mode.tsx';
import type { Aggregation } from '@/types/aggregation.ts';
import { Box, Flex, VStack } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import JSON5 from 'json5';
import { useEffect, useState } from 'react';

type Props = {
  onChange: (value: Aggregation) => void;
};

const defaultValue = `// Source.aggregate(
[
]
// )
`;

export const Editor = ({ onChange }: Props) => {
  const { colorMode } = useColorMode();

  const [stringValue, setStringValue] = useState<string | undefined>(
    defaultValue,
  );

  const [isValid, setIsValid] = useState<boolean>(true);
  // TODO: invalid handling
  console.log(isValid);

  useEffect(() => {
    if (!stringValue) return;
    try {
      const res = JSON5.parse(stringValue);
      console.log(res);
      onChange(res);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  }, [stringValue, onChange]);

  return (
    <MonacoEditor
      theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
      defaultLanguage="javascript"
      value={stringValue}
      onChange={setStringValue}
    />
  );
};
