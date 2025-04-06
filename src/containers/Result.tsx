import { FieldBadge } from '@/components/FieldBadge.tsx';
import { type AnalysisResult, isFieldResult } from '@/utils/analyze';
import { Card, DataList } from '@chakra-ui/react';

type Props = {
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
    </div>
  );
};
