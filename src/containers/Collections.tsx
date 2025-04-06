import { type AnalysisResult, isFieldResult } from '@/utils/analyze';
import { Badge, Box, Card, DataList } from '@chakra-ui/react';

export type Props = {
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
                {Object.entries(fields).map(([label, item]) => (
                  <DataList.Item key={label}>
                    <DataList.ItemLabel>{label}</DataList.ItemLabel>
                    {isFieldResult(item) ? (
                      <DataList.ItemValue>
                        <Badge w="20px" bg={item.color} />
                      </DataList.ItemValue>
                    ) : (
                      <>Nested!</>
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
