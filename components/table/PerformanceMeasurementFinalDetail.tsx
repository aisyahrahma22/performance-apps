import React from 'react';
import { Grid, Header, Segment, Table } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import TablePlaceholder from '../placeholder/TablePlaceholder';

interface TablePerformancesProps {
  data: any;
  loading: boolean;
}

const TablePerformanceMeasurementFinalDetail = ({
  data,
  loading,
}: TablePerformancesProps) => {
  const headerTable = [
    { name: 'No.', width: 3 },
    { name: 'Code', width: 3 },
    { name: 'Name', width: 4 },
    { name: 'Min', width: 3 },
    { name: 'Max', width: 3 },
  ];
  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nopadding hcms-table'}>
          <div style={{ marginBottom: '10px' }}>
            <Segment basic className={'nomargin'}>
              <Grid columns="equal">
                {headerTable?.map((header: any) => {
                  return (
                    <>
                      <Grid.Column width={header?.width} textAlign={'center'}>
                        <Header>{header?.name}</Header>
                      </Grid.Column>
                    </>
                  );
                })}
              </Grid>
            </Segment>
            <Table
              className={'nomargin'}
              color={'black'}
              singleLine
              compact
              fixed
            >
              <Table.Body>
                {loading && <TablePlaceholder rowCount={15} colCount={5} />}
                {!loading && !data && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={5}>
                      No Data
                    </Table.Cell>
                  </Table.Row>
                )}
                {!loading &&
                  data.dataGradeFinal?.map((performance: any) => (
                    <Table.Row key={performance.id}>
                      <Table.Cell textAlign={'center'} width={3}>
                        {renderHyphen(performance.order)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'} width={3}>
                        {renderHyphen(performance.codeGrade)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'} width={4}>
                        {renderHyphen(performance.codeName)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'} width={3}>
                        {renderHyphen(performance.minimum)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'} width={3}>
                        {renderHyphen(performance.maximum)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </Segment>
      </Segment>
    </>
  );
};

export default TablePerformanceMeasurementFinalDetail;
