import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Icon,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import renderHyphen from '../../lib/util/renderHyphen';
import renderEnum from '../../lib/util/renderEnum';
import { toUpper } from 'lodash';
import { useFormik } from 'formik';
import InputField from '../Input';
interface TableRegulerManagerTimelineControlProps {
  dataMultiple: any;
  dataSelected: any;
  timeline: any;
  isLoading: boolean;
  sectionMultipleManager: boolean;
  message: any;
  countNoTimeline: number | string;
  countNoApproval: number | string;
  totalData: number | string;
}

const TableRegulerManagerTimelineControl = ({
  dataMultiple,
  dataSelected,
  timeline,
  isLoading,
  sectionMultipleManager,
  message,
  countNoTimeline,
  countNoApproval,
  totalData,
}: TableRegulerManagerTimelineControlProps) => {
  const [employeeName, setEmployeeName] = useState<string>('');
  const formikPerfTimelineControlFilters = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      setEmployeeName(values?.name);
    },
    onReset: () => {
      setEmployeeName('');
    },
  });

  const currentItems = sectionMultipleManager
    ? dataSelected?.data
    : dataSelected;
  const formikPerfTimelineControlFilterResetPress = useCallback(
    () => formikPerfTimelineControlFilters.resetForm(),
    [formikPerfTimelineControlFilters],
  );

  const dataFil = useMemo(() => {
    if (employeeName) {
      const item = sectionMultipleManager
        ? dataSelected?.data?.filter((val: any) =>
            toUpper(val?.fullName).includes(toUpper(employeeName)),
          )
        : dataSelected?.filter((val: any) =>
            toUpper(val?.fullName).includes(toUpper(employeeName)),
          );
      if (item?.length > 0) return item;
      else return [];
    }
  }, [isLoading, employeeName]);
  const dataFilMultiple = useMemo(() => {
    if (employeeName) {
      const data = dataMultiple?.data?.filter((val: any) =>
        toUpper(val?.fullName).includes(toUpper(employeeName)),
      );
      if (data?.length > 0) return data;
      else return [];
    }
  }, [isLoading, employeeName]);

  const reguler = !employeeName
    ? currentItems
    : dataFil?.length > 0
    ? dataFil
    : [];
  const multiple =
    sectionMultipleManager || dataFil?.length > 0
      ? !employeeName
        ? dataMultiple?.data
        : dataFilMultiple?.length > 0
        ? dataFilMultiple
        : []
      : [];
  const totalCount = sectionMultipleManager
    ? dataSelected?.totalCount
    : multiple?.length == 0
    ? dataSelected?.length
    : reguler?.length;
  const totalCountMultiple =
    reguler?.length == 0 ? dataMultiple?.totalCount : multiple?.length;
  const errorLabeling = (header: any, message: any, count: any) => {
    return (
      <Segment clearing basic className={'nomargin nopaddingb'}>
        <List.Content>
          <List.Header>
            <Icon name={'warning circle'} color="red" /> {header}
          </List.Header>
          There are {count} {message}
        </List.Content>
      </Segment>
    );
  };
  return (
    <>
      <Segment>
        <Form onSubmit={formikPerfTimelineControlFilters.handleSubmit}>
          <Form.Group widths={'equal'}>
            <InputField
              formik={formikPerfTimelineControlFilters}
              name={'name'}
              label={''}
              placeholder={'search'}
            />
            <Popup
              trigger={
                <Button
                  disabled={!formikPerfTimelineControlFilters.dirty}
                  type={'reset'}
                  onClick={formikPerfTimelineControlFilterResetPress}
                  basic
                  icon
                >
                  <Icon name="close" />
                </Button>
              }
              content="Clear Filter"
              inverted
              position={'top center'}
              size="mini"
            />
            <Button floated="right" color={'violet'} type={'submit'}>
              Search
            </Button>
          </Form.Group>
        </Form>
      </Segment>
      <List verticalAlign="middle">
        <List.Item className="timeline-control-list-view">
          {countNoTimeline ? (
            <>
              {errorLabeling(
                'Selected Timeline Not Configured in the Form',
                'employees that does not have the selected timeline configured in the form. The system will skip these employee.',
                countNoTimeline,
              )}
            </>
          ) : (
            ''
          )}
          {countNoApproval ? (
            <>
              {errorLabeling(
                'No Approver',
                'employees that does not have approver. The system will skip these employee.',
                countNoApproval,
              )}
            </>
          ) : (
            ''
          )}
          <br />
        </List.Item>
      </List>
      <div></div>
      {!isLoading &&
      reguler?.length > 0 &&
      totalData !== countNoApproval &&
      totalData !== countNoTimeline ? (
        <List verticalAlign="middle">
          <span style={{ marginLeft: '2px' }}>
            There are {reguler?.length} employees (excluding the below) eligible
            for timeline change to
            <span
              style={{
                fontWeight: 'bold',
                marginLeft: '3px',
                marginRight: '4px',
              }}
            >
              {renderEnum(timeline)}.
            </span>
            Are you sure you want to proceed?
          </span>
        </List>
      ) : (
        ''
      )}
      {dataFilMultiple?.length > 0 || reguler?.length == 0 ? (
        ''
      ) : (
        <Segment
          className={'nopadding hcms-table'}
          style={{
            marginTop:
              totalData !== countNoApproval || totalData !== countNoTimeline
                ? '0px'
                : '20px',
          }}
        >
          <Segment clearing basic className={'nomargin'}></Segment>
          <div>
            <Table
              className={'nomargin'}
              color={'teal'}
              singleLine
              compact
              fixed
            >
              <Table.Header>
                <Table.Row>
                  <TableHeaderCell
                    width={4}
                    className={'margin'}
                    name={'Employee Name'}
                  />
                  <TableHeaderCell
                    width={6}
                    className={'margin'}
                    name={'Position'}
                  />
                  <TableHeaderCell
                    width={5}
                    className={'margin'}
                    name={'Timeline'}
                  />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading && <TablePlaceholder rowCount={3} colCount={2} />}
                {!isLoading && reguler?.length == 0 && (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={3}>
                      {'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isLoading &&
                  reguler?.map((data: any, index: any) => (
                    <Table.Row key={`employee-participant-${index}`}>
                      <Popup
                        content={<List>{renderHyphen(data?.fullName)}</List>}
                        trigger={
                          <Table.Cell>
                            {renderHyphen(data?.fullName)}
                          </Table.Cell>
                        }
                      />
                      <Popup
                        content={<List>{renderHyphen(data?.position)}</List>}
                        trigger={
                          <Table.Cell>
                            {renderHyphen(data?.position)}
                          </Table.Cell>
                        }
                      />
                      <Popup
                        content={<List>{renderEnum(data?.timeline)}</List>}
                        trigger={
                          <Table.Cell>{renderEnum(data?.timeline)}</Table.Cell>
                        }
                      />
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
          <Segment clearing basic className={'nomargin'}>
            {!isLoading && reguler?.length > 0 && (
              <>
                Show <b>{reguler?.length}</b> of <b>{totalCount}</b> entries
              </>
            )}
          </Segment>
        </Segment>
      )}
      {!isLoading && multiple?.length > 0 && sectionMultipleManager && (
        <List verticalAlign="middle" style={{ marginTop: '20px' }}>
          <span>
            The below{' '}
            {multiple?.length == 1 ? 'employee has' : 'employees have'} the same
            level 1 & 2 approver.
          </span>
          <span>
            {' '}
            {totalData !== countNoTimeline ? (
              <span>
                The system will change the timeline to
                <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                  {message}
                </span>{' '}
                instead.
              </span>
            ) : (
              ''
            )}
          </span>
          {/* <span>
            {`The below ${
              multiple?.length == 1 ? 'employee has' : 'employees have'
            } the same level 1 & 2 approver. 
            ${totalData !== countNoTimeline ? <>
             The system will change the timeline to 
             <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
              {message}
            </span>{' '}
            instead.
            </> : ''}
            `}
          </span> */}
        </List>
      )}
      {multiple?.length > 0 ? (
        <Segment className={'nopadding hcms-table'}>
          <Segment clearing basic className={'nomargin'}></Segment>
          <div>
            <Table
              className={'nomargin'}
              color={'teal'}
              singleLine
              compact
              fixed
            >
              <Table.Header>
                <Table.Row>
                  <TableHeaderCell
                    width={4}
                    className={'margin'}
                    name={'Employee Name'}
                  />
                  <TableHeaderCell
                    width={6}
                    className={'margin'}
                    name={'Position'}
                  />
                  <TableHeaderCell
                    width={5}
                    className={'margin'}
                    name={'Timeline'}
                  />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading && <TablePlaceholder rowCount={3} colCount={2} />}
                {!isLoading && multiple?.length == 0 && (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={3}>
                      {'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isLoading &&
                  multiple?.map((data: any, index: any) => (
                    <Table.Row key={`employee-participant-${index}`}>
                      <Popup
                        content={<List>{renderHyphen(data?.fullName)}</List>}
                        trigger={
                          <Table.Cell>
                            {renderHyphen(data?.fullName)}
                          </Table.Cell>
                        }
                      />
                      <Popup
                        content={<List>{renderHyphen(data?.position)}</List>}
                        trigger={
                          <Table.Cell>
                            {renderHyphen(data?.position)}
                          </Table.Cell>
                        }
                      />
                      <Popup
                        content={<List>{renderEnum(data?.timeline)}</List>}
                        trigger={
                          <Table.Cell>{renderEnum(data?.timeline)}</Table.Cell>
                        }
                      />
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
          <Segment clearing basic className={'nomargin'}>
            {!isLoading && multiple?.length > 0 && (
              <>
                Show <b>{multiple?.length}</b> of <b>{totalCountMultiple}</b>{' '}
                entries
              </>
            )}
          </Segment>
        </Segment>
      ) : (
        ''
      )}
    </>
  );
};

export default TableRegulerManagerTimelineControl;
