import React from 'react';
import {
  Button,
  Card,
  Header,
  Icon,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import usePerfGoalSettingNotes from '../../../lib/data/performanceGoalSetting/usePerfGoalSettingNotes';
import renderDate from '../../../lib/util/renderDate';
import renderEnum from '../../../lib/util/renderEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import { renderNumber } from '../../../lib/util/renderNumber';
import TablePlaceholder from '../../placeholder/TablePlaceholder';
import TableHeaderCell from '../../TableHeaderCell';
import TablePaginationNew from '../../TablePaginationNew';

interface TablePerfEmpNoteGSProps {
  id: string;
  defaultFilter?: any;
}

const TablePerfEmpNoteGS = ({
  id,
  defaultFilter = {},
}: TablePerfEmpNoteGSProps) => {
  const {
    perfGoalSettingNotes,
    isPerfGoalSettingNotesError,
    isPerfGoalSettingNotesLoading,
    perfGoalSettingNotesRefreshPress,
    isPerfGoalSettingNotesEmpty,
    perfGoalSettingNotesTotalCount,
    perfGoalSettingNotesTotalPage,
    perfGoalSettingNotesPage,
    perfGoalSettingNotesPagePress,
    perfGoalSettingNotesPerPage,
    perfGoalSettingNotesNextFivePagePress,
    perfGoalSettingNotesPrevFivePagePress,
    perfGoalSettingNotesFirstPagePress,
    perfGoalSettingNotesLastPagePress,
  } = usePerfGoalSettingNotes({
    perfEmployeeId: id,
    ...defaultFilter,
  });

  return (
    <>
      <Segment raised className={'nopadding hcms-table'}>
        <Segment basic clearing className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={perfGoalSettingNotesRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <Header style={{ marginTop: 0 }} as={'h3'}>
            NOTES
          </Header>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!isPerfGoalSettingNotesLoading}
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
            style={{ width: '120%' }}
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell width={1} name={'No'} />
                <TableHeaderCell width={2} name={'Actor'} />
                <TableHeaderCell width={3} name={'Name'} />
                <TableHeaderCell width={5} name={'Notes'} />
                <TableHeaderCell width={2} name={'Note Date'} />
                <TableHeaderCell width={5} name={'Timeline'} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfGoalSettingNotesLoading && (
                <TablePlaceholder rowCount={5} colCount={5} />
              )}
              {!isPerfGoalSettingNotesLoading && isPerfGoalSettingNotesEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={6}>
                    {isPerfGoalSettingNotesError
                      ? isPerfGoalSettingNotesError?.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfGoalSettingNotesLoading &&
                perfGoalSettingNotes?.map((data: any, index: number) => (
                  <Table.Row key={data?.id}>
                    <Table.Cell>
                      {renderNumber(
                        (perfGoalSettingNotesPage - 1) *
                          perfGoalSettingNotesPerPage +
                          (index + 1),
                      )}
                    </Table.Cell>
                    <Popup
                      content={<List>{renderEnum(data?.type)}</List>}
                      trigger={
                        <Table.Cell>{renderEnum(data?.type)}</Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderHyphen(data?.updaterEmp?.fullName)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data?.updaterEmp?.fullName)}
                        </Table.Cell>
                      }
                    />

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
                    <Popup
                      content={<List>{renderEnum(data?.timeline)}</List>}
                      trigger={
                        <Table.Cell>{renderEnum(data?.timeline)}</Table.Cell>
                      }
                    />
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfGoalSettingNotesLoading && !isPerfGoalSettingNotesEmpty && (
            <>
              Show <b>{perfGoalSettingNotes?.length}</b> of{' '}
              <b>{perfGoalSettingNotesTotalCount}</b> entries
              {perfGoalSettingNotesTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfGoalSettingNotesPagePress}
                  totalPage={perfGoalSettingNotesTotalPage}
                  activePage={perfGoalSettingNotesPage}
                  nextFivePagePress={perfGoalSettingNotesNextFivePagePress}
                  prevFivePagePress={perfGoalSettingNotesPrevFivePagePress}
                  firstPagePress={perfGoalSettingNotesFirstPagePress}
                  lastPagePress={perfGoalSettingNotesLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
    </>
  );
};

export default TablePerfEmpNoteGS;
