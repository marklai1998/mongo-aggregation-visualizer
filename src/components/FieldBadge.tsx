import { useHoveringField } from '@/hooks/useHoveringField.ts';
import { getColor } from '@/utils/getColor.ts';
import { type Field, ValueType } from '@/utils/newAnalyze';
import { Badge, HStack } from '@chakra-ui/react';
import { equals } from 'ramda';
import { AiOutlineFieldString, AiOutlineFunction } from 'react-icons/ai';

type Props = {
  field: Field;
};

const hexToRgb = (hex: string) => {
  const bigint = Number.parseInt(hex, 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;

  return { red, green, blue };
};

const darkOrLight = (hex: string) => {
  const { red, green, blue } = hexToRgb(hex);

  let brightness: number;
  brightness = red * 299 + green * 587 + blue * 114;
  brightness = brightness / 255000;

  // values range from 0 to 1
  // anything greater than 0.5 should be bright enough for dark text
  if (brightness >= 0.5) {
    return 'dark';
  }
  return 'light';
};

export const FieldBadge = ({ field }: Props) => {
  const { hoveringId, setHoveringId } = useHoveringField();

  const color = getColor(`${String(field.id.collection)}.${field.id.path}`);

  return (
    <HStack>
      <Badge
        minW={field?.value ? undefined : '40px'}
        bg={`#${color}`}
        {...(equals(hoveringId, field.id) ? { 'data-focus': true } : {})}
        focusRing="outside"
        color={darkOrLight(color) === 'dark' ? 'black' : 'white'}
        onMouseOver={() => {
          setHoveringId(field.id);
        }}
        onMouseOut={() => {
          setHoveringId(null);
        }}
      >
        {field?.value?.type === ValueType.STRING && (
          <>
            <AiOutlineFieldString />
            {field.value.value}
          </>
        )}
        {field?.value?.type === ValueType.EXPRESSION && (
          <>
            <AiOutlineFunction />
            {JSON.stringify(field.value.expression)}
          </>
        )}
      </Badge>
    </HStack>
  );
};
