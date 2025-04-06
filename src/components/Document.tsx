import { FieldBadge } from '@/components/FieldBadge.tsx';
import type { Document as MongoDocument } from '@/utils/analyze';
import { isFieldResult } from '@/utils/analyze/analyzeUtil.ts';
import { Card, DataList } from '@chakra-ui/react';

type Props = {
  document: MongoDocument;
};

export const Document = ({ document }: Props) => (
  <Card.Root size="sm" w="full" variant="outline">
    <Card.Body>
      <DataList.Root size="sm" orientation="horizontal">
        {Object.entries(document)
          .toSorted(([a], [b]) => (a === '_id' ? -1 : a.localeCompare(b)))
          .map(([label, item]) => (
            <DataList.Item key={label} alignItems="start">
              <DataList.ItemLabel lineHeight="tall">{label}</DataList.ItemLabel>
              {isFieldResult(item) ? (
                <DataList.ItemValue>
                  <FieldBadge field={item} />
                </DataList.ItemValue>
              ) : (
                <Document document={item} />
              )}
            </DataList.Item>
          ))}
      </DataList.Root>
    </Card.Body>
  </Card.Root>
);
