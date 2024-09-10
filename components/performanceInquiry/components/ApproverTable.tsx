import React from 'react';
import { Button, Grid, Header, Icon, Segment, Table } from 'semantic-ui-react';
import TableHeaderCell from '../../TableHeaderCell';
import { PFWorkflowTypeEnum } from '../../../lib/enums/PerformanceEnum';
import { RightEnum } from '../../../lib/enums/RightEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import TablePlaceholder from '../../placeholder/TablePlaceholder';
import { RenderGuard } from '../../RenderGuard';

interface ApproverTableProps {
  id?: string;
  approvers: any;
  editable: boolean;
  refreshPress?: any;
  changeApproverPress?: any;
  isLoading: any;
  isError: any;
}

export default function ApproverTable({
  id,
  approvers,
  editable,
  refreshPress,
  changeApproverPress,
  isLoading,
  isError,
}: ApproverTableProps) {
  let number = 0;

  return (
    <Segment raised className={'nopadding'}>
      <Grid columns={'equal'} style={{ margin: 2 }}>
        <Grid.Column verticalAlign="middle">
          <Header size="small" color="teal">
            Approvers
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Button
            size={'tiny'}
            floated="right"
            onClick={refreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>

          {editable && (
            <RenderGuard actionKey={RightEnum.PERFORMANCE_INQUIRY_VIEW}>
              <Button
                size={'tiny'}
                floated="right"
                color={'teal'}
                icon
                onClick={changeApproverPress(id)}
                labelPosition={'right'}
              >
                Change Approver
                <Icon name={'exchange'} />
              </Button>
            </RenderGuard>
          )}
        </Grid.Column>
      </Grid>

      <div className={'horizontal-scroll'}>
        <Table
          selectable={!isLoading}
          className={'nomargin'}
          color={'teal'}
          singleLine
          compact
          fixed
        >
          <Table.Header>
            <Table.Row>
              <TableHeaderCell width={1} sortable name={'No'} />
              <TableHeaderCell
                width={6}
                sortable
                attribute={'approverName'}
                name={'Approver Name'}
              />
              <TableHeaderCell
                width={8}
                sortable
                attribute={'Position'}
                name={'position'}
              />
              <TableHeaderCell
                width={3}
                sortable
                attribute={'approvalLevel'}
                name={'Approval Level'}
              />
              <TableHeaderCell
                width={3}
                sortable
                attribute={'status'}
                name={'Status'}
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && <TablePlaceholder rowCount={5} colCount={4} />}
            {!isLoading && approvers.length === 0 && (
              <Table.Row>
                <Table.Cell textAlign={'center'} colSpan={5}>
                  {isError
                    ? isError.response?.data?.message || 'Error'
                    : 'No Data'}
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading &&
              approvers?.map(
                (approver: any, _index: number) =>
                  approver.type === PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER && (
                    <Table.Row key={approver.id}>
                      <Table.Cell>
                        {renderHyphen((number = number + 1))}
                      </Table.Cell>
                      <Table.Cell>
                        {renderHyphen(approver.assignee?.fullName)}
                      </Table.Cell>
                      <Table.Cell>
                        {renderHyphen(approver.assignee?.position?.name)}
                      </Table.Cell>
                      <Table.Cell>
                        {approver.level === 1 ? (
                          <>Direct Manager</>
                        ) : (
                          <>Above Direct Manager</>
                        )}
                      </Table.Cell>
                      <Table.Cell>{renderHyphen(approver.status)}</Table.Cell>
                    </Table.Row>
                  ),
              )}
          </Table.Body>
        </Table>
      </div>
    </Segment>
  );
}
