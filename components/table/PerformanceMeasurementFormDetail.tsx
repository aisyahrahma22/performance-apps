import React from 'react';
import { Segment, Table } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';

interface TablePerformancesProps {
  data: any;
  loading: boolean;
}

const TablePerformanceMeasurementFormDetail = ({
  data,
  loading,
}: TablePerformancesProps) => {
  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
          GRADE
          <div className={'horizontal-scroll'}>
            <Table
              className={'nomargin'}
              color={'black'}
              singleLine
              compact
              fixed
            >
              <Table.Header>
                <Table.Row>
                  <TableHeaderCell
                    width={4}
                    textAlign={'center'}
                    className={'padding'}
                    attribute={'gradeCode'}
                    name={'Code'}
                  />
                  <TableHeaderCell
                    width={4}
                    attribute={'gradeName'}
                    textAlign={'center'}
                    name={'Name'}
                  />
                  <TableHeaderCell
                    width={4}
                    attribute={'point'}
                    textAlign={'center'}
                    name={'Score'}
                  />
                </Table.Row>
              </Table.Header>
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
                  data.dataGrade?.map((performance: any) => (
                    <Table.Row key={performance.id}>
                      <Table.Cell textAlign={'center'}>
                        {renderHyphen(performance.gradeCode)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'}>
                        {renderHyphen(performance.gradeName)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'}>
                        {renderHyphen(performance.point)}
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

export default TablePerformanceMeasurementFormDetail;
