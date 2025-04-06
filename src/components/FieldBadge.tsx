import { useHoveringField } from '@/hooks/useHoveringField.ts';
import type { FieldResult } from '@/utils/analyze';
import { Badge } from '@chakra-ui/react';

type Props = {
  field: FieldResult;
};

export const FieldBadge = ({ field }: Props) => {
  const { hoveringId, setHoveringId } = useHoveringField();

  return (
    <Badge
      w="20px"
      bg={field.color}
      {...(hoveringId === field.id ? { 'data-focus': true } : {})}
      focusRing="outside"
      onMouseOver={() => {
        setHoveringId(field.id);
      }}
      onMouseOut={() => {
        setHoveringId(null);
      }}
    />
  );
};
