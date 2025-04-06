import { FieldBadge } from '@/components/FieldBadge.tsx';
import { type AnalysisResult, isFieldResult } from '@/utils/analyze';
import { Box, Card, DataList } from '@chakra-ui/react';

type Props = {
  state: AnalysisResult;
};

export const Collections = ({ state: { collections } }: Props) => {
  return (
    <div>
      {Object.entries(collections).map(([name, { fields }]) => (
        <Box key={name}>
          <Box bg="bg.muted" borderRadius="md" fontSize="sm" padding="3" mb="4">
            {name}
          </Box>
          <Card.Root size="sm">
            <Card.Body>
              <DataList.Root size="sm" orientation="horizontal">
                {Object.entries(fields)
                  .toSorted(([a], [b]) =>
                    a === '_id' ? -1 : a.localeCompare(b),
                  )
                  .map(([label, item]) => (
                    <DataList.Item key={label}>
                      <DataList.ItemLabel>{label}</DataList.ItemLabel>
                      {isFieldResult(item) ? (
                        <DataList.ItemValue>
                          <FieldBadge field={item} />
                        </DataList.ItemValue>
                      ) : (
                        <>TODO: Nested</>
                      )}
                    </DataList.Item>
                  ))}
              </DataList.Root>
            </Card.Body>
          </Card.Root>
        </Box>
      ))}
    </div>
  );
};
