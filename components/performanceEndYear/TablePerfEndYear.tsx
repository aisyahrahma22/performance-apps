import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Popup, Segment, Table } from 'semantic-ui-react';
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
import ModalPerfEndYearEdit from './modals/ModalPerfEndYearEdit';
import ModalPerfEndYearDetail from './modals/ModalPerfEndYearDetail';
import usePerfEndYears from '../../lib/data/PerfEndYear/usePerfEndYears';
import { isWtihinDateRange } from '../../lib/util/isWtihinDateRange';
import DatePicker from '../DatePicker';
import PerformanceFormStatusIcon from '../performanceGoalSetting/components/PerformanceFormStatusIcon';
import { timelineEnum } from '../../lib/enums/PerformanceEnum';
import { renderTimelinePeriodBasedStatus } from '../performanceGoalSetting/helpers/renderTimelinePeriodBasedStatus';
import {
  perfEmployeeStatusOptions,
  timelinesListOption,
} from '../../lib/data/perfMidYear/helpers/dropdownOptions';
import dateLabeling from '../../lib/util/dateLabeling';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerfEndYearProps {
  showFilter?: boolean;
}

// const enableEdit = (timeline: timelineEnum, status: PerfSuperiorStatusEnum) => {
//   if (
//     [
//       PerfSuperiorStatusEnum.REQUESTED,
//       PerfSuperiorStatusEnum.DRAFT,
//       PerfSuperiorStatusEnum.REVISED,
//     ].includes(status) &&
//     [
//       timelineEnum.END_YEAR_DIRECT_MANAGER,
//       timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
//     ].includes(timeline)
//   )
//     return true;
//   return false;
// };

export const renderTimelinePeriod = (timelineSeq: any) => {
  return `${renderDate(timelineSeq?.startDate, 'dd/MM/yyyy')} - ${dateLabeling(
    timelineSeq?.endDate,
  )}`;
};

const TablePerfEndYear = ({ showFilter = true }: TablePerfEndYearProps) => {
  const now = new Date().getFullYear().toString();
  const {
    perfEndYears,
    isPerfEndYearsEmpty,
    isPerfEndYearsLoading,
    isPerfEndYearsError,
    perfEndYearsTotalCount,
    perfEndYearsTotalPage,
    perfEndYearsRefreshPress,
    perfEndYearsPage,
    setPerfEndYearsFilter,
    perfEndYearsPagePress,
    perfEndYearsSort,
    perfEndYearsSortPress,
    perfEndYearsNextFivePagePress,
    perfEndYearsPrevFivePagePress,
    perfEndYearsFirstPagePress,
    perfEndYearsLastPagePress,
  } = usePerfEndYears({ year: now });

  const formikFilter = useFormik({
    initialValues: {
      programName: '',
      formCode: '',
      formTypeConfig: '',
      status: [],
      period: '',
      timelineStatus: '',
      year: '',
    },
    onSubmit: (values) => {
      const payload = {
        perfProgram: {
          name: values?.programName,
          // year: values.year,
        },
        perfForm: {
          performanceFormCode: values?.formCode,
        },
        perfFormName: {
          name: values?.formTypeConfig,
        },
        status: values?.status,
        period: values?.period,
        timelineSeq: {
          timeline: values?.timelineStatus,
        },
        year: values.year,
      };
      setPerfEndYearsFilter(payload);
    },
    onReset: () => {
      setPerfEndYearsFilter({ year: '' });
    },
  });

  const formikFilterResetPress = useCallback(
    () => formikFilter.resetForm(),
    [formikFilter],
  );

  // Modal Edit
  const [isModalEndYearEdit, setIsModalEndYearEdit] = useState(false);
  const [modalEndYearEditData, setModalEndYearEditData] = useState<any>(null);

  const perfEndYearEditOpenPress = useCallback(
    (perfEmp) => () => {
      setModalEndYearEditData(perfEmp?.id);
      setIsModalEndYearEdit(true);
    },
    [],
  );

  const perfEndYearEditClosePress = useCallback(() => {
    perfEndYearsRefreshPress();
    setIsModalEndYearEdit(false);
    setModalEndYearEditData(null);
  }, [perfEndYearsRefreshPress]);

  // Modal Detail
  const [isModalEndYearDetail, setIsModalEndYearDetail] = useState(false);
  const [modalEndYearDetailData, setModalEndYearDetailData] =
    useState<any>(null);

  const perfEndYearDetailOpenPress = useCallback(
    (perfEmp) => () => {
      setModalEndYearDetailData(perfEmp?.id);
      setIsModalEndYearDetail(true);
    },
    [],
  );

  const perfEndYearDetailClosePress = useCallback(() => {
    setIsModalEndYearDetail(false);
    setModalEndYearDetailData(null);
    perfEndYearsRefreshPress(); // for after recall
  }, [perfEndYearsRefreshPress]);

  const isOutdated = (data: any): boolean => {
    return isWtihinDateRange(
      new Date(),
      data?.timelineSeq?.startDate,
      data?.timelineSeq?.endDate,
    );
  };
  useEffect(() => {
    formikFilter.setFieldValue('year', now);
    setPerfEndYearsFilter({ year: now });
  }, []);

  return (
    <>
      <Segment className={'nopadding'}>
      <Segment  basic clearing className={'nomargin'}>
      {showFilter && (
        <Form onSubmit={formikFilter.handleSubmit}>
        <Form.Group widths={'equal'}>
          <Input
            value={formikFilter.values.programName}
            placeholder={'Performance Program Name'}
            label={'Performance Program Name'}
            formik={formikFilter}
            name={'programName'}
          />
          <Input
            value={formikFilter.values.formCode}
            placeholder={'Performance Form Code'}
            label={'Performance Form Code'}
            formik={formikFilter}
            name={'formCode'}
          />
          <Input
            value={formikFilter.values.formTypeConfig}
            placeholder={'Performance Form Name'}
            label={'Performance Form Name'}
            formik={formikFilter}
            name={'formTypeConfig'}
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
              onClick={perfEndYearsRefreshPress as any}
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
            selectable={!(isPerfEndYearsLoading || isPerfEndYearsEmpty)}
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
                  name={'Program name'}
                  attribute={'name'}
                  direction={perfEndYearsSort?.name}
                  onSortPress={perfEndYearsSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={4}
                  name={'Performance Form Code'}
                  attribute={'performanceFormCode'}
                  direction={perfEndYearsSort?.performanceFormCode}
                  onSortPress={perfEndYearsSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={4}
                  name={'Performance Form Name'}
                  attribute={'perfFormName'}
                  direction={perfEndYearsSort?.perfFormName}
                  onSortPress={perfEndYearsSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={3}
                  name={'Status'}
                  attribute={'status'}
                  direction={perfEndYearsSort?.status}
                  onSortPress={perfEndYearsSortPress as any}
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
              {isPerfEndYearsLoading && (
                <TablePlaceholder rowCount={10} colCount={8} />
              )}
              {!isPerfEndYearsLoading && isPerfEndYearsEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={6}>
                    {isPerfEndYearsError
                      ? isPerfEndYearsError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfEndYearsError &&
                perfEndYears?.map((data: any) => (
                  <Table.Row key={data?.id}>
                    <Table.Cell>
                      {renderHyphen(data?.perfForm?.perfProgram?.name)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(data?.perfForm?.performanceFormCode)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(data?.perfForm?.perfFormName?.name)}
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
                          timelineEnum.END_YEAR_APPRAISEE &&
                        isOutdated(data) ? (
                          <RenderGuard
                            actionKey={RightEnum.ENDYEAR_EMPLOYEE_EDIT}
                          >
                            <Button
                              icon={'pencil'}
                              onClick={perfEndYearEditOpenPress(data)}
                            />
                          </RenderGuard>
                        ) : (
                          <RenderGuard
                            actionKey={RightEnum.ENDYEAR_EMPLOYEE_VIEW}
                          >
                            <Button
                              icon={'eye'}
                              onClick={perfEndYearDetailOpenPress(data)}
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
          {!isPerfEndYearsLoading && !isPerfEndYearsEmpty && (
            <>
              Show <b>{perfEndYears?.length}</b> of{' '}
              <b>{perfEndYearsTotalCount}</b> entries
              {perfEndYearsTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfEndYearsPagePress}
                  totalPage={perfEndYearsTotalPage}
                  activePage={perfEndYearsPage}
                  nextFivePagePress={perfEndYearsNextFivePagePress}
                  prevFivePagePress={perfEndYearsPrevFivePagePress}
                  firstPagePress={perfEndYearsFirstPagePress}
                  lastPagePress={perfEndYearsLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
      {isModalEndYearEdit && (
        <ModalPerfEndYearEdit
          id={modalEndYearEditData}
          closePress={perfEndYearEditClosePress}
          isOpen={isModalEndYearEdit}
        />
      )}
      {isModalEndYearDetail && (
        <ModalPerfEndYearDetail
          id={modalEndYearDetailData}
          closePress={perfEndYearDetailClosePress}
          isOpen={isModalEndYearDetail}
        />
      )}
    </>
  );
};

export default TablePerfEndYear;
