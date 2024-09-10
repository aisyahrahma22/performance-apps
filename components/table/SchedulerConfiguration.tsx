import { Popup, Table } from 'semantic-ui-react';
import React from 'react';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import TablePagination from '../TablePagination';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import useScheduler from '../../lib/data/scheduler/useScheduler';
import renderEnum from '../../lib/util/renderEnum';
import Titles from '../revamp/components/Titles';
import { repeatInformation } from '../scheduler/helper/repeatInfoScheduler';

interface TableSchedulerConfigurationProps {
  showFilter?: boolean;
  onSelect: any;
}

const TableSchedulerConfiguration = ({
  onSelect,
}: TableSchedulerConfigurationProps) => {
  const {
    scheduler,
    isSchedulerEmpty,
    isSchedulerLoading,
    isSchedulerError,
    schedulerTotalCount,
    schedulerTotalPage,
    schedulerPagePress,
    schedulerPage,
  } = useScheduler();

  return (
    <>
      <Titles
        pageTitle="Scheduler"
        firstPage="Configuration"
        secondPage="Scheduler"
      />
      <Table
        className="rvtables"
        singleLine
        compact
        fixed
        style={{ width: '100%' }}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell name={'Scheduler Name'} width={4}>
              Scheduler Name
            </Table.HeaderCell>
            <Table.HeaderCell name={'Repeatation'} width={5}>
              Schedule
            </Table.HeaderCell>
            <Table.HeaderCell name={'Date & Time'} width={3}>
              Interval
            </Table.HeaderCell>
            <Table.HeaderCell name={'Status'} width={2}>
              Status
            </Table.HeaderCell>
            <Table.HeaderCell width={2}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isSchedulerLoading && (
            <TablePlaceholder rowCount={15} colCount={9} />
          )}
          {!isSchedulerLoading && isSchedulerEmpty && (
            <Table.Row>
              <Table.Cell textAlign={'center'} colSpan={9}>
                {isSchedulerError
                  ? isSchedulerError.response?.data?.message || 'Error'
                  : 'No Data'}
              </Table.Cell>
            </Table.Row>
          )}
          {!isSchedulerLoading &&
            scheduler?.map((sc: any) => (
              <Table.Row key={sc.id}>
                <Popup
                  trigger={
                    <Table.Cell>{renderEnum(sc?.schedulerName)}</Table.Cell>
                  }
                  content={renderEnum(sc?.schedulerName)}
                  inverted
                  position="top center"
                  size={'mini'}
                />
                <Popup
                  trigger={<Table.Cell>{repeatInformation(sc)}</Table.Cell>}
                  content={repeatInformation(sc)}
                  inverted
                  position="top center"
                  size={'mini'}
                />
                <Table.Cell>{renderEnum(sc?.repeat)}</Table.Cell>
                <Table.Cell>
                  {sc?.isRunning ? (
                    <span className="rv-font color-green">Active</span>
                  ) : (
                    <span className="rv-font color-red">Inactive</span>
                  )}
                </Table.Cell>
                <Table.Cell textAlign={'center'}>
                  <RenderGuard actionKey={RightEnum.SCHEDULER_VIEW}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => onSelect(sc)}
                    >
                      edit
                    </span>
                  </RenderGuard>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
        {!isSchedulerLoading && !isSchedulerEmpty && (
          <Table.Footer>
            <Table.Row>
              <Table.Cell
                colSpan={9}
                style={{ borderTop: '1px solid #D0D5DD' }}
              >
                <div className="rvflexs row space-between center">
                  <div>
                    <span className="rvtexts regular text-s">Show</span>
                    <span className="rvtexts semibold text-s">
                      {' '}
                      {scheduler?.length}
                    </span>
                    <span className="rvtexts regular text-s"> of </span>
                    <span className="rvtexts semibold text-s">
                      {' '}
                      {schedulerTotalCount}
                    </span>
                    <span className="rvtexts regular text-s"> entries</span>
                  </div>
                  <div>
                    {schedulerTotalPage > 0 && (
                      <TablePagination
                        pagePress={schedulerPagePress}
                        totalPage={schedulerTotalPage}
                        activePage={schedulerPage}
                      />
                    )}
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
};

export default TableSchedulerConfiguration;
