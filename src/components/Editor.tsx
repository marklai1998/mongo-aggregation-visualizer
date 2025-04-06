import { useColorMode } from '@/components/ui/color-mode.tsx';
import { type Aggregation, aggregation } from '@/types/aggregation.ts';
import MonacoEditor from '@monaco-editor/react';
import Ajv from 'ajv';
import JSON5 from 'json5';
import { useEffect, useState } from 'react';

const ajv = new Ajv();

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

  const [, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (!stringValue) return;
    try {
      const res = JSON5.parse(stringValue);
      const valid = ajv.validate(aggregation, res);
      if (!valid) {
        console.log(ajv.errors);
        setIsValid(false);
        return;
      }

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
