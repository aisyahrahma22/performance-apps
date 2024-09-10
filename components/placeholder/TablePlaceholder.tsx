import { Placeholder, Table } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import produceLooping from '../../lib/util/produceLooping';

const TablePlaceholder = ({
  rowCount = 10,
  colCount = 3,
}: {
  rowCount: number;
  colCount: number;
}) => {
  const rows = useMemo(() => {
    return produceLooping(rowCount).map((_rowNum, idx) => (
      <Table.Row key={`row-${idx}`}>
        {produceLooping(colCount).map((_cellNum, idx) => (
          <Table.Cell key={`row-${idx}`}>
            <Placeholder fluid>
              <Placeholder.Line length="full" />
            </Placeholder>
          </Table.Cell>
        ))}
      </Table.Row>
    ));
  }, [rowCount, colCount]);
  return <>{rows}</>;
};

export default TablePlaceholder;
