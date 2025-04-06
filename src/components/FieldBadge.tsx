import { useHoveringField } from '@/hooks/useHoveringField.ts';
import type { FieldResult } from '@/utils/analyze';
import { Badge } from '@chakra-ui/react';

type Props = {
  field: FieldResult;
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

  console.log(hex, red, green, blue);

  // values range from 0 to 1
  // anything greater than 0.5 should be bright enough for dark text
  if (brightness >= 0.5) {
    return 'dark';
  }
  return 'light';
};

export const FieldBadge = ({ field }: Props) => {
  const { hoveringId, setHoveringId } = useHoveringField();

  return (
    <Badge
      minW="20px"
      bg={`#${field.color}`}
      {...(hoveringId === field.id ? { 'data-focus': true } : {})}
      focusRing="outside"
      size="xs"
      color={darkOrLight(field.color) === 'dark' ? 'black' : 'white'}
      onMouseOver={() => {
        setHoveringId(field.id);
      }}
      onMouseOut={() => {
        setHoveringId(null);
      }}
    >
      {field?.valueLiteral}
    </Badge>
  );
};
