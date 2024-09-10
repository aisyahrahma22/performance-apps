import React from 'react';
import { Button, Header, Icon, Segment, Table } from 'semantic-ui-react';
import usePerfEmpNotes from '../../../lib/data/perfMidYear/usePerfMidEndYearNotes';
import renderEnum from '../../../lib/util/renderEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import TablePlaceholder from '../../placeholder/TablePlaceholder';
import TableHeaderCell from '../../TableHeaderCell';
import TablePaginationNew from '../../TablePaginationNew';

interface TablePerfEmpNoteProps {
  id: string;
  defaultFilter?: any;
  isEndYear: boolean;
}

const TablePerfEmpNote = ({
  id,
  defaultFilter = {},
  isEndYear,
}: TablePerfEmpNoteProps) => {
  const {
    perfEmpNotes,
    isPerfEmpNotesError,
    isPerfEmpNotesLoading,
    perfEmpNotesRefreshPress,
    isPerfEmpNotesEmpty,
    perfEmpNotesTotalCount,
    perfEmpNotesTotalPage,
    perfEmpNotesPage,
    perfEmpNotesPagePress,
    perfEmpNotesNextFivePagePress,
    perfEmpNotesPrevFivePagePress,
    perfEmpNotesFirstPagePress,
    perfEmpNotesLastPagePress,
  } = usePerfEmpNotes(
    {
      perfEmployeeId: id,
      ...defaultFilter,
    },
    isEndYear,
  );

  return (
    <>
      <Segment raised className={'nopadding hcms-table'}>
        <Segment basic clearing className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={perfEmpNotesRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <Header style={{ marginTop: 0 }} as={'h4'}>
            NOTES
          </Header>
        </Segment>
        <div>
          <Table
            selectable={!isPerfEmpNotesLoading}
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell width={2} name={'Actor'} />
                <TableHeaderCell width={4} name={'Name'} />
                <TableHeaderCell width={6} name={'Notes'} />
                <TableHeaderCell width={4} name={'Timeline'} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfEmpNotesLoading && (
                <TablePlaceholder rowCount={5} colCount={4} />
              )}
              {!isPerfEmpNotesLoading && isPerfEmpNotesEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={4}>
                    {isPerfEmpNotesError
                      ? isPerfEmpNotesError?.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfEmpNotesLoading &&
                perfEmpNotes?.map((data: any) => (
                  <Table.Row key={data?.id}>
                    <Table.Cell>{renderEnum(data?.type)}</Table.Cell>
                    <Table.Cell>
                      {renderHyphen(data?.updaterEmp?.fullName)}
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(data?.note)}</Table.Cell>
                    <Table.Cell>{renderEnum(data?.timeline)}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfEmpNotesLoading && !isPerfEmpNotesEmpty && (
            <>
              Show <b>{perfEmpNotes?.length}</b> of{' '}
              <b>{perfEmpNotesTotalCount}</b> entries
              {perfEmpNotesTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfEmpNotesPagePress}
                  totalPage={perfEmpNotesTotalPage}
                  activePage={perfEmpNotesPage}
                  nextFivePagePress={perfEmpNotesNextFivePagePress}
                  prevFivePagePress={perfEmpNotesPrevFivePagePress}
                  firstPagePress={perfEmpNotesFirstPagePress}
                  lastPagePress={perfEmpNotesLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
    </>
  );
};

export default TablePerfEmpNote;
