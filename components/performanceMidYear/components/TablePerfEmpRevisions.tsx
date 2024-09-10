import React from 'react';
import {
  Button,
  Card,
  Header,
  Icon,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import usePerfEmpRevisions from '../../../lib/data/perfMidYear/usePerfMidYearRevisions';
import {
  PerfEmpRevisionNoteTypeEnum,
  TimelineNoteType,
} from '../../../lib/enums/GoalSetting';
import renderDate from '../../../lib/util/renderDate';
import renderHyphen from '../../../lib/util/renderHyphen';
import { renderNumber } from '../../../lib/util/renderNumber';
import TablePlaceholder from '../../placeholder/TablePlaceholder';
import TableHeaderCell from '../../TableHeaderCell';
import TablePaginationNew from '../../TablePaginationNew';

interface TablePerfEmpRevisionProps {
  id: string;
  defaultFilter?: any;
  timelineNoteType: TimelineNoteType;
}

const renderType = (type?: string) => {
  switch (type) {
    case PerfEmpRevisionNoteTypeEnum.DIRECT_MANAGER:
      return 'Level 1';
    case PerfEmpRevisionNoteTypeEnum.ABOVE_MANAGER:
      return 'Level 2';
    default:
      return '—';
  }
};

const TablePerfEmpRevision = ({
  id,
  defaultFilter = {},
  timelineNoteType,
}: TablePerfEmpRevisionProps) => {
  const {
    perfEmpRevisions,
    isPerfEmpRevisionsError,
    isPerfEmpRevisionsLoading,
    perfEmpRevisionsRefreshPress,
    isPerfEmpRevisionsEmpty,
    perfEmpRevisionsTotalCount,
    perfEmpRevisionsTotalPage,
    perfEmpRevisionsPage,
    perfEmpRevisionsPagePress,
    perfEmpRevisionsPerPage,
    perfEmpRevisionsNextFivePagePress,
    perfEmpRevisionsPrevFivePagePress,
    perfEmpRevisionsFirstPagePress,
    perfEmpRevisionsLastPagePress,
  } = usePerfEmpRevisions(
    {
      perfEmployeeId: id,
      ...defaultFilter,
    },
    timelineNoteType,
  );

  return (
    <>
      <Segment raised className={'nopadding hcms-table'}>
        <Segment basic clearing className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={perfEmpRevisionsRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <Header style={{ marginTop: 0 }} as={'h4'}>
            REVISIONS LOG
          </Header>
        </Segment>
        <div>
          <Table
            selectable={!isPerfEmpRevisionsLoading}
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell width={1} name={'No'} />
                <TableHeaderCell width={4} name={'Approver Name'} />
                <TableHeaderCell width={6} name={'Notes'} />
                <TableHeaderCell width={2} name={'Approval Date'} />
                <TableHeaderCell width={2} name={'Approval Level'} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfEmpRevisionsLoading && (
                <TablePlaceholder rowCount={5} colCount={5} />
              )}
              {!isPerfEmpRevisionsLoading && isPerfEmpRevisionsEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={4}>
                    {isPerfEmpRevisionsError
                      ? isPerfEmpRevisionsError?.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfEmpRevisionsLoading &&
                perfEmpRevisions?.map((data: any, index: number) => (
                  <Table.Row key={data?.id}>
                    <Table.Cell>
                      {renderNumber(
                        (perfEmpRevisionsPage - 1) * perfEmpRevisionsPerPage +
                          (index + 1),
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(data?.updaterEmp?.fullName)}
                    </Table.Cell>
                    <Popup
                      content={
                        <Card>
                          <Card.Content
                            description={renderHyphen(data?.note)}
                          />
                          <Card.Content extra>
                            <Icon name="user" />
                            {renderHyphen(data?.updaterEmp?.fullName)}
                          </Card.Content>
                        </Card>
                      }
                      trigger={
                        <Table.Cell>{renderHyphen(data?.note)}</Table.Cell>
                      }
                    />
                    <Table.Cell>
                      {renderDate(data?.createdAt, 'dd/MM/yyyy')}
                    </Table.Cell>
                    <Table.Cell>{renderType(data?.type)}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfEmpRevisionsLoading && !isPerfEmpRevisionsEmpty && (
            <>
              Show <b>{perfEmpRevisions?.length}</b> of{' '}
              <b>{perfEmpRevisionsTotalCount}</b> entries
              {perfEmpRevisionsTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfEmpRevisionsPagePress}
                  totalPage={perfEmpRevisionsTotalPage}
                  activePage={perfEmpRevisionsPage}
                  nextFivePagePress={perfEmpRevisionsNextFivePagePress}
                  prevFivePagePress={perfEmpRevisionsPrevFivePagePress}
                  firstPagePress={perfEmpRevisionsFirstPagePress}
                  lastPagePress={perfEmpRevisionsLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
    </>
  );
};

export default TablePerfEmpRevision;
