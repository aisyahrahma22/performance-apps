import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Popup, Segment, Table } from 'semantic-ui-react';
import usePerfMidYears from '../../lib/data/perfMidYear/usePerfMidYears';
import renderHyphen from '../../lib/util/renderHyphen';
// import DatePicker from '../DatePicker';
import Input from '../Input';
import InputDropdownSimple from '../InputDropdownSimple';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import TableHeaderCell from '../TableHeaderCell';
import { renderEnum } from '../../lib/util/renderEnum';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import renderDate from '../../lib/util/renderDate';
import ModalPerfMidYearEdit from './ModalPerfMidYearEdit';
import ModalPerfMidYearDetail from './ModalPerfMidYearDetail';
import {
  PFWorkflowTypeEnum,
  timelineEnum,
} from '../../lib/enums/PerformanceEnum';
import { isWtihinDateRange } from '../../lib/util/isWtihinDateRange';
import DatePicker from '../DatePicker';
import PerformanceFormStatusIcon from '../performanceGoalSetting/components/PerformanceFormStatusIcon';
import { renderTimelinePeriodBasedStatus } from '../performanceGoalSetting/helpers/renderTimelinePeriodBasedStatus';
import {
  perfEmployeeStatusOptions,
  timelinesListOption,
} from '../../lib/data/perfMidYear/helpers/dropdownOptions';
import dateLabeling from '../../lib/util/dateLabeling';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerfMidYearProps {
  showFilter?: boolean;
}

// const enableEdit = (status: PerfEmployeeStatusEnum) => {
//   if (
//     [
//       PerfEmployeeStatusEnum.AVAILABLE,
//       PerfEmployeeStatusEnum.DRAFT,
//       PerfEmployeeStatusEnum.REVISED,
//       PerfEmployeeStatusEnum.NO_APPROVAL,
//     ].includes(status)
//   )
//     return true;
//   return false;
// };

export const renderTimelinePeriod = (timelineSeq: any) => {
  return `${renderDate(timelineSeq?.startDate, 'dd/MM/yyyy')} - ${dateLabeling(
    timelineSeq?.endDate,
  )}`;
};

const TablePerfMidYear = ({ showFilter = true }: TablePerfMidYearProps) => {
  const now = new Date().getFullYear().toString();
  const {
    perfMidYears,
    isPerfMidYearsEmpty,
    isPerfMidYearsLoading,
    isPerfMidYearsError,
    perfMidYearsTotalCount,
    perfMidYearsTotalPage,
    perfMidYearsRefreshPress,
    perfMidYearsPage,
    setPerfMidYearsFilter,
    perfMidYearsPagePress,
    perfMidYearsSort,
    perfMidYearsSortPress,
    perfMidYearsNextFivePagePress,
    perfMidYearsPrevFivePagePress,
    perfMidYearsFirstPagePress,
    perfMidYearsLastPagePress,
  } = usePerfMidYears({ year: now });

  const formikFilter = useFormik({
    initialValues: {
      programName: '',
      formCode: '',
      formTypeConfig: '',
      status: [],
      timelineStatus: '',
      year: '',
    },
    onSubmit: (values) => {
      const payload = {
        perfProgram: {
          name: values?.programName,
        },
        perfForm: {
          performanceFormCode: values?.formCode,
        },
        perfFormName: {
          name: values?.formTypeConfig,
        },
        status: values?.status,
        // period: values?.period,
        timelineSeq: {
          timeline: values?.timelineStatus,
        },
        year: values.year,
      };
      setPerfMidYearsFilter(payload);
    },
    onReset: () => {
      setPerfMidYearsFilter({ year: '' });
    },
  });

  const formikFilterResetPress = useCallback(
    () => formikFilter.resetForm(),
    [formikFilter],
  );

  // Modal Edit
  const [isModalMidYearEdit, setIsModalMidYearEdit] = useState(false);
  const [modalMidYearEditData, setModalMidYearEditData] = useState<any>(null);

  const perfMidYearEditOpenPress = useCallback(
    (perfEmp) => () => {
      setModalMidYearEditData(perfEmp?.id);
      setIsModalMidYearEdit(true);
    },
    [],
  );

  const perfMidYearEditClosePress = useCallback(() => {
    perfMidYearsRefreshPress();
    setIsModalMidYearEdit(false);
    setModalMidYearEditData(null);
  }, [perfMidYearsRefreshPress]);

  // Modal Detail
  const [isModalMidYearDetail, setIsModalMidYearDetail] = useState(false);
  const [modalMidYearDetailData, setModalMidYearDetailData] =
    useState<any>(null);

  const perfMidYearDetailOpenPress = useCallback(
    (perfEmp) => () => {
      setModalMidYearDetailData(perfEmp?.id);
      setIsModalMidYearDetail(true);
    },
    [],
  );

  const perfMidYearDetailClosePress = useCallback(() => {
    setIsModalMidYearDetail(false);
    setModalMidYearDetailData(null);
    perfMidYearsRefreshPress(); // for after recall
  }, [perfMidYearsRefreshPress]);

  const isOutdated = (data: any): boolean => {
    return isWtihinDateRange(
      new Date(),
      data?.timelineSeq?.startDate,
      data?.timelineSeq?.endDate,
    );
  };
  useEffect(() => {
    formikFilter.setFieldValue('year', now);
    setPerfMidYearsFilter({ year: now });
  }, []);
  return (
    <>
      <Segment className={'nopadding'}>
        <Segment basic clearing className={'nomargin'}>
        {showFilter && (
          <Form onSubmit={formikFilter.handleSubmit}>
          <Form.Group widths={'equal'}>
            <Input
              value={formikFilter.values.formTypeConfig}
              placeholder={'Performance Form Name'}
              label={'Performance Form Name'}
              formik={formikFilter}
              name={'formTypeConfig'}
            />
              <InputDropdownSimple
              placeholder="Timeline Status"
              options={timelinesListOption}
              formik={formikFilter}
              name={'timelineStatus'}
              label={'Timeline Status'}
            />
            <InputDropdownSimple
              multiple
              placeholder="Status"
              options={perfEmployeeStatusOptions}
              formik={formikFilter}
              name={'status'}
              label={'Status'}
            />
            <DatePicker
              name={'year'}
              placeholder={new Date().getFullYear().toString()}
              label={'Program Year'}
              formik={formikFilter}
              yearOnly
            />
            <Form.Field>
              <label>&nbsp;</label>
              <Popup
                trigger={
                  <Button
                    disabled={!formikFilter.dirty}
                    type={'reset'}
                    onClick={formikFilterResetPress}
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
              <Button floated="left" secondary type={'submit'}>
                Search
              </Button>
              <Button
                size={'tiny'}
                floated="right"
                onClick={perfMidYearsRefreshPress as any}
                basic
                icon
              >
                <Icon name="refresh" />
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        )}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerfMidYearsLoading || isPerfMidYearsEmpty)}
            className={'nomargin'}
            color={'black'}
            singleLine
            compact
            fixed
            style={{ width: '100%' }}
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell
                  sortable
                  width={4}
                  name={'Performance Form Name'}
                  attribute={'perfFormName'}
                  direction={perfMidYearsSort?.perfFormName}
                  onSortPress={perfMidYearsSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={4}
                  name={'Timeline Period'}
                  attribute={'startDate'}
                  direction={perfMidYearsSort?.startDate}
                  onSortPress={perfMidYearsSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  name={'Timeline Status'}
                  attribute={'timeline'}
                  direction={perfMidYearsSort?.timeline}
                  onSortPress={perfMidYearsSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={3}
                  name={'status'}
                  attribute={'status'}
                  direction={perfMidYearsSort?.status}
                  onSortPress={perfMidYearsSortPress as any}
                />
                <Table.HeaderCell
                  className={'nopadding'}
                  width={2}
                  collapsing
                  textAlign={'center'}
                ></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfMidYearsLoading && (
                <TablePlaceholder rowCount={10} colCount={8} />
              )}
              {!isPerfMidYearsLoading && isPerfMidYearsEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={6}>
                    {isPerfMidYearsError
                      ? isPerfMidYearsError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfMidYearsError &&
                perfMidYears?.map((data: any) => (
                  <Table.Row key={data?.id}>
                    <Table.Cell>
                      {renderHyphen(data?.perfForm?.perfFormName?.name)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderTimelinePeriod(data?.timelineSeq)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderEnum(data?.timelineSeq?.timeline)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderTimelinePeriodBasedStatus(
                        data?.timelineSeq,
                        data?.status,
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        {data?.timelineSeq?.timeline ==
                          timelineEnum.MID_YEAR_COACHING_SELF &&
                        isOutdated(data) ? (
                          <RenderGuard
                            actionKey={RightEnum.MIDYEAR_EMPLOYEE_EDIT}
                          >
                            <Button
                              icon={'pencil'}
                              onClick={perfMidYearEditOpenPress(data)}
                            />
                          </RenderGuard>
                        ) : (
                          <RenderGuard
                            actionKey={RightEnum.MIDYEAR_EMPLOYEE_VIEW}
                          >
                            <Button
                              icon={'eye'}
                              onClick={perfMidYearDetailOpenPress(data)}
                            />
                          </RenderGuard>
                        )}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfMidYearsLoading && !isPerfMidYearsEmpty && (
            <>
              Show <b>{perfMidYears?.length}</b> of{' '}
              <b>{perfMidYearsTotalCount}</b> entries
              {perfMidYearsTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfMidYearsPagePress}
                  totalPage={perfMidYearsTotalPage}
                  activePage={perfMidYearsPage}
                  nextFivePagePress={perfMidYearsNextFivePagePress}
                  prevFivePagePress={perfMidYearsPrevFivePagePress}
                  firstPagePress={perfMidYearsFirstPagePress}
                  lastPagePress={perfMidYearsLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
      {isModalMidYearEdit && (
        <ModalPerfMidYearEdit
          id={modalMidYearEditData}
          closePress={perfMidYearEditClosePress}
          isOpen={isModalMidYearEdit}
        />
      )}
      {isModalMidYearDetail && (
        <ModalPerfMidYearDetail
          id={modalMidYearDetailData}
          closePress={perfMidYearDetailClosePress}
          isOpen={isModalMidYearDetail}
        />
      )}
    </>
  );
};

export default TablePerfMidYear;
