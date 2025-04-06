import { type AnalysisResult, isFieldResult } from '@/utils/analyze';
import { Badge, Card, DataList } from '@chakra-ui/react';

export type Props = {
  state: AnalysisResult;
};

export const Result = ({ state }: Props) => {
  return (
    <div>
      <Card.Root size="sm">
        <Card.Body>
          <DataList.Root size="sm" orientation="horizontal">
            {Object.entries(state.result).map(([label, item]) => (
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
    </div>
  );
};
