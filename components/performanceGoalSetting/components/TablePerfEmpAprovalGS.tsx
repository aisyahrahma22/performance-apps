import React, { useState } from 'react';
import {
  Button,
  Header,
  Icon,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import usePerfGSApproval from '../../../lib/data/performanceGoalSetting/usePerfGSApproval';
import { PerfSuperiorStatusEnum } from '../../../lib/enums/GoalSetting';
import renderDate from '../../../lib/util/renderDate';
import renderEnum from '../../../lib/util/renderEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import TablePlaceholder from '../../placeholder/TablePlaceholder';
import TablePaginationNew from '../../TablePaginationNew';

interface TableApprovalGSProps {
  id: string;
  defaultFilter?: any;
  isModalChangeApprovalClose?: any;
}

export const checkStatus = (
  status: PerfSuperiorStatusEnum,
  revisionDate: Date,
  approvedDate: Date,
) => {
  if (status === PerfSuperiorStatusEnum.APPROVED) {
    return renderDate(approvedDate);
  } else if (status === PerfSuperiorStatusEnum.REVISED) {
    return renderDate(revisionDate);
  } else if (status === PerfSuperiorStatusEnum.COMPLETED) {
    return renderDate(approvedDate);
  } else {
    return '-';
  }
};

const TableApproval = ({ id, defaultFilter = {} }: TableApprovalGSProps) => {
  const {
    perfGSApproval,
    isPerfGSApprovalError,
    isPerfGSApprovalLoading,
    perfGSApprovalRefreshPress,
    isPerfGSApprovalEmpty,
    perfGSApprovalTotalCount,
    perfGSApprovalTotalPage,
    perfGSApprovalPage,
    perfGSApprovalPagePress,
    perfGSApprovalNextFivePagePress,
    perfGSApprovalPrevFivePagePress,
    perfGSApprovalFirstPagePress,
    perfGSApprovalLastPagePress,
  } = usePerfGSApproval({
    perfEmployeeId: id,
    ...defaultFilter,
  });

  const [isHide, setIsHide] = useState(false);

  return (
    <>
     <Segment basic clearing className={'nomargin'}>
          <Button
            icon
            onClick={() => setIsHide(!isHide)}
            size="tiny"
            basic
            floated="right"
          >
            <Icon name={isHide ? 'chevron down' : 'chevron up'} />
          </Button>
          <Button
            size={'tiny'}
            floated="right"
            onClick={perfGSApprovalRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <Header style={{ marginTop: 0 }} as={'h3'}>
            APPROVALS
          </Header>
        </Segment>
        <Segment>
        {!isHide && (
          <>
            <div>
              <Table
                selectable={!isPerfGSApprovalLoading}
                className={'nomargin'}
                color={'black'}
                singleLine
                compact
                fixed
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={2}>No</Table.HeaderCell>
                    <Table.HeaderCell width={5}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={3}>
                      Level
                    </Table.HeaderCell>
                    <Table.HeaderCell width={3}>Approval Date</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {isPerfGSApprovalLoading && (
                    <TablePlaceholder rowCount={3} colCount={9} />
                  )}
                  {!isPerfGSApprovalLoading && isPerfGSApprovalEmpty && (
                    <Table.Row>
                      <Table.Cell textAlign="center" colSpan={3}>
                        {isPerfGSApprovalError
                          ? isPerfGSApprovalError?.response?.data?.message ||
                            'Error'
                          : 'No Data'}
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {!isPerfGSApprovalLoading &&
                    perfGSApproval?.map((data: any, index: any) => (
                      <Table.Row key={`approval-${index}`}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Popup
                          content={
                            <List>
                              {renderHyphen(data?.assignee?.fullName)}
                            </List>
                          }
                          trigger={
                            <Table.Cell>
                              {renderHyphen(data?.assignee?.fullName)}
                            </Table.Cell>
                          }
                        />
                        <Table.Cell>{`Level ${data?.level}`}</Table.Cell>
                        <Table.Cell>
                          {checkStatus(
                            data?.endYearStatus,
                            data?.endYearRevisedAt,
                            data?.endYearApprovedAt,
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
            <Segment clearing basic className={'nomargin'}>
              {!isPerfGSApprovalLoading && !isPerfGSApprovalEmpty && (
                <>
                  Show <b>{perfGSApproval?.length}</b> of{' '}
                  <b>{perfGSApprovalTotalCount}</b> entries
                  {perfGSApprovalTotalPage > 1 && (
                    <TablePaginationNew
                      pagePress={perfGSApprovalPagePress}
                      totalPage={perfGSApprovalTotalPage}
                      activePage={perfGSApprovalPage}
                      nextFivePagePress={perfGSApprovalNextFivePagePress}
                      prevFivePagePress={perfGSApprovalPrevFivePagePress}
                      firstPagePress={perfGSApprovalFirstPagePress}
                      lastPagePress={perfGSApprovalLastPagePress}
                    />
                  )}
                </>
              )}
            </Segment>
          </>
        )}
        </Segment>
    </>
  );
};

export default TableApproval;
