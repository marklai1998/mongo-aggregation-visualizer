import { Tooltip } from '@/components/ui/tooltip.tsx';
import { useHoveringField } from '@/hooks/useHoveringField.ts';
import type { Field } from '@/utils/analyze';
import { Badge, HStack, IconButton } from '@chakra-ui/react';
import { Fragment } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

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
    <HStack>
      <Badge
        minW="40px"
        bg={`#${field.color}`}
        {...(hoveringId === field.id ? { 'data-focus': true } : {})}
        focusRing="outside"
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
      {field.status.map((status, idx) => {
        if ('isUnseted' in status && status.isUnseted) {
          return (
            <Tooltip
              content={`This field is unseted, step: ${status.step + 1}`}
              openDelay={0}
              closeDelay={0}
              // biome-ignore lint/suspicious/noArrayIndexKey: doesn't matter
              key={idx}
            >
              <IconButton size="2xs" variant="ghost" colorPalette="red">
                <AiOutlineDelete />
              </IconButton>
            </Tooltip>
          );
        }
        // biome-ignore lint/suspicious/noArrayIndexKey: doesn't matter
        return <Fragment key={idx} />;
      })}
    </HStack>
  );
};
