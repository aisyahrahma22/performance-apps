import { forEach } from 'lodash';
import React, { useMemo } from 'react';
import {
  Button,
  Header,
  Icon,
  Label,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import usePerfEmpApprovalList from '../../../lib/data/perfMidYear/usePerfMidYearApprovalList';
import renderDate from '../../../lib/util/renderDate';
import renderEnum from '../../../lib/util/renderEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import TablePlaceholder from '../../placeholder/TablePlaceholder';

interface TablePerfEmpApprovalListProps {
  id: string;
  header?: string;
  isEndYear: boolean;
}

type PerfEmpApprovalDataProps = {
  level: number;
  data: any;
  approverNames: string[];
  approverDate: string;
  status: string;
};

const TablePerfEmpApprovalList = ({
  id,
  header = 'APPROVALS',
  isEndYear,
}: TablePerfEmpApprovalListProps) => {
  const {
    perfEmpApprovalList,
    perfEmpApprovalListRefreshPress,
    isPerfEmpApprovalListEmpty,
    isPerfEmpApprovalListError,
    isPerfEmpApprovalListLoading,
  } = usePerfEmpApprovalList(id, isEndYear);

  const approvals = useMemo(() => {
    const result: PerfEmpApprovalDataProps[] = [];

    if (perfEmpApprovalList) {
      forEach(perfEmpApprovalList, (data, level: number) => {
        const firstData = data?.[0];
        let approverNames: string[] = [];
        let approverDate = '';
        let status = '';
        if (firstData?.midYearApprovedBy && firstData?.midYearApprovedAt) {
          const fullName = firstData?.midYearApprovedBy?.fullName || '';
          approverNames.push(fullName);

          approverDate = firstData?.midYearApprovedAt || '';
          status = 'Approved';
        } else if (firstData?.midYearRevisedBy && firstData?.midYearRevisedAt) {
          const fullName = firstData?.midYearRevisedBy?.fullName || '';
          approverNames.push(fullName);

          approverDate = firstData?.midYearRevisedAt;
          status = 'Revised';
        } else if (data?.length) {
          approverNames =
            data?.map((appr: any) => appr?.assignee?.fullName || '') || [];
          status = renderEnum(firstData?.midYearStatus) || 'Pending';
        }

        result.push({
          level,
          data,
          approverNames,
          approverDate,
          status,
        });
      });
    }

    return result;
  }, [perfEmpApprovalList]);

  return (
    <>
      <Segment raised className={'nopadding hcms-table'}>
        <Segment basic clearing className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={perfEmpApprovalListRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <Header style={{ marginTop: 0 }}>{header}</Header>
        </Segment>
        <div>
          <Table
            selectable={!isPerfEmpApprovalListLoading}
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={2}>No</Table.HeaderCell>
                <Table.HeaderCell width={6}>Approver Name</Table.HeaderCell>
                <Table.HeaderCell width={3}>Approver Date</Table.HeaderCell>
                <Table.HeaderCell width={3}>Approver Level</Table.HeaderCell>
                <Table.HeaderCell width={2}>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfEmpApprovalListLoading && (
                <TablePlaceholder rowCount={5} colCount={5} />
              )}
              {!isPerfEmpApprovalListLoading && isPerfEmpApprovalListEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={5}>
                    {isPerfEmpApprovalListError
                      ? isPerfEmpApprovalListError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfEmpApprovalListLoading &&
                approvals?.map((appr, index) => (
                  <Table.Row key={`perf-mid-year-approval-${index}`}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Popup
                      content={
                        <List>
                          {appr?.approverNames?.map((name, idx) => (
                            <Label
                              key={`perf-mid-year-appr-${index}-name-${idx}`}
                            >
                              {renderHyphen(name)}
                            </Label>
                          ))}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(
                            appr?.approverNames
                              ?.map((name) => name)
                              ?.join('; '),
                          )}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell>{renderDate(appr?.approverDate)}</Table.Cell>
                    <Table.Cell>{`Level ${appr?.level}`}</Table.Cell>
                    <Table.Cell>{renderHyphen(appr?.status)}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}></Segment>
      </Segment>
    </>
  );
};

export default TablePerfEmpApprovalList;
