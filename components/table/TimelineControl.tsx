import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import { useFormik } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import usePerfTimelineControl from '../../lib/data/perfTimelineControl/usePerfTimelineControl';
import renderDate from '../../lib/util/renderDate';
import ModalPerfTimelineControlDetail from '../modal/PerfTimelineControlDetail';
import ModalPerfTimelineControlEdit from '../modal/PerfTimelineControlEdit';
import { includes, remove } from 'lodash';
import InputDropdownRemote from '../InputDropdownRemote';
import { getPerfNameList } from '../../lib/data/performanceForm/usePerfNameList';
import renderEnum from '../../lib/util/renderEnum';
import { getPositions } from '../../lib/data/position/usePositions';
import Input from '../Input';
import useEmpHasDataAccess from '../../lib/data/dataAccessMapping/useEmpHasDataAccess';
import DatePicker from '../DatePicker';
import TablePaginationNew from '../TablePaginationNew';

interface TableTimelineControlProps {
  showFilter?: boolean;
}

const TableTimelineControl = ({
  showFilter = false,
}: TableTimelineControlProps) => {
  const { isRequiredAccessMapping, isValidAccess } = useEmpHasDataAccess();
  const now = new Date().getFullYear().toString();
  const {
    perfTimelineControl,
    isPerfTimelineControlEmpty,
    isPerfTimelineControlLoading,
    perfTimelineControlTotalCount,
    perfTimelineControlTotalPage,
    setPerfTimelineControlFilter,
    perfTimelineControlRefreshPress,
    perfTimelineControlPage,
    perfTimelineControlPagePress,
    perfTimelineControlSort,
    perfTimelineControlSortPress,
    isPerfTimelineControlError,
    perfTimelineControlNextFivePagePress,
    perfTimelineControlPrevFivePagePress,
    perfTimelineControlFirstPagePress,
    perfTimelineControlLastPagePress,
  } = usePerfTimelineControl({
    isRequiredAccessMapping,
    isValidAccess,
    year: now,
  });
  const [filterData, setFilterData] = useState<any>([]);
  const formikPerfTimelineControlFilter = useFormik({
    initialValues: {
      programName: '',
      perfFormName: '',
      positionCode: '',
      employeeId: '',
      employeeName: '',
      performanceFormCode: '',
      timelineStatus: '',
      status: '',
      startDate: '',
      year: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        perfProgram: { id: values.programName },
        perfFormName: { id: values.perfFormName },
        employee: {
          fullName: values.employeeName,
          code: values.employeeId,
        },
        position: {
          code: values.positionCode,
        },
        perfForm: { performanceFormCode: values.performanceFormCode },
        timelineSeq: {
          timeline: values.timelineStatus,
          startDate: values.startDate,
        },
        status: values.status,
        year: values.year,
        isValidAccess,
        isRequiredAccessMapping,
      };
      setFilterData(newFilter);
      setPerfTimelineControlFilter(newFilter);
    },

    onReset: () => {
      setFilterData({ year: '' });
      setPerfTimelineControlFilter({
        isRequiredAccessMapping,
        isValidAccess,
        year: '',
      });
    },
  });

  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [isSelectedAllData, setIsSelectedAllData] = useState(false);

  const [isModalPerformanceDetail, setIsModalPerformanceDetail] =
    useState(false);
  const [isModalPerformanceEdit, setIsModalPerformanceEdit] = useState(false);
  const [modalPerformanceDetailData, setModalPerformanceDetailData] =
    useState<any>(null);
  const [modalPerformanceEditData, setModalPerformanceEditData] =
    useState<any>(null);

  // const [modalMultipleData, setModalMultipleData] = useState<string[]>([]);
  const [isModalMultiple, setIsModalMultiple] = useState(false);
  // Modal Detail
  const modalPerformanceDetailOpenPress = useCallback(
    (perfTimelineControl) => () => {
      setModalPerformanceDetailData(perfTimelineControl.id);
      setIsModalPerformanceDetail(true);
    },
    [],
  );

  const modalPerformanceDetailClosePress = useCallback(() => {
    setIsModalPerformanceDetail(false);
    setSelectedData([]);
  }, []);

  // Modal Edit
  const modalPerformanceEditClosePress = useCallback(() => {
    perfTimelineControlRefreshPress();
    setIsModalPerformanceEdit(false);
    setSelectedData([]);
  }, [perfTimelineControlRefreshPress]);

  const modalPerformanceEditOpenPress = useCallback(
    (perfTimelineControl) => () => {
      setModalPerformanceEditData(perfTimelineControl.id);
      setIsModalPerformanceEdit(true);
    },
    [],
  );
  const [isSelectedOnePageData, setIsSelectedOnePageData] = useState(false);
  const formikPerfTimelineControlFilterResetPress = useCallback(
    () => formikPerfTimelineControlFilter.resetForm(),
    [formikPerfTimelineControlFilter],
  );

  const multipleDataPress = useCallback(() => {
    setIsModalMultiple(true);
  }, []);

  const selectedAllDataPress = useCallback(() => {
    const tempData: any = [...selectedData];
    if (isSelectedAllData) {
      for (const value of perfTimelineControl) {
        if (includes(tempData, value)) remove(tempData, (n) => n === value);
      }
    } else {
      for (const value of perfTimelineControl) {
        if (!includes(tempData, value)) tempData.push(value);
      }
    }
    setIsSelectedAllData(!isSelectedAllData);
    setSelectedData(tempData);
  }, [isSelectedAllData, selectedData, perfTimelineControl]);

  const selectedDataPress = useCallback(
    (value) => {
      setIsSelectedAllData(false);
      const tempData: any = [...selectedData];
      if (includes(tempData, value)) remove(tempData, (n) => n === value);
      else tempData.push(value);
      setSelectedData(tempData);
    },
    [selectedData],
  );

  const selectedOnlyThisPageDataPress = useCallback(() => {
    if (selectedData?.length == 0) {
      setIsSelectedOnePageData(true);
      setSelectedData(perfTimelineControl);
      setIsSelectedAllData(false);
    } else {
      for (const value of perfTimelineControl) {
        setSelectedData((data: any) => {
          const newData: any = [...data];
          const findVal = newData?.find((val: any) => val?.id === value?.id);
          if (findVal) remove(newData, (n) => n === value);
          else newData.push(value);
          setIsSelectedOnePageData(true);
          return newData;
        });
      }
    }
  }, [perfTimelineControl, selectedData, isSelectedOnePageData]);

  const modalMultipleClosePress = useCallback(() => {
    // setModalMultipleData([]);
    // setSelectedData([])
    // setIsSelectedAllData(false)
    setIsModalMultiple(false);
    perfTimelineControlRefreshPress();
    setSelectedData([]);
  }, [perfTimelineControlRefreshPress]);

  const modalMultipleYesPress = useCallback(() => {
    perfTimelineControlRefreshPress();
  }, [perfTimelineControlRefreshPress]);

  const refreshPress = useCallback(() => {
    setSelectedData([]);
    setIsSelectedAllData(false);
    perfTimelineControlRefreshPress();
  }, [perfTimelineControlRefreshPress]);

  useEffect(() => {
    formikPerfTimelineControlFilter.setFieldValue('year', now);
    setPerfTimelineControlFilter({
      year: now,
      isValidAccess,
      isRequiredAccessMapping,
    });
    setFilterData({ year: now });
  }, []);

  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
          <Form onSubmit={formikPerfTimelineControlFilter.handleSubmit}>
          <Form.Group widths={'equal'}>
            <InputDropdownRemote
              placeholder={'Form Name'}
              label={'Form Name'}
              name={'perfFormName'}
              formik={formikPerfTimelineControlFilter}
              apiFetcher={getPerfNameList}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'id'}
            />
            <Input
              placeholder={'Form Code'}
              label={'Form Code'}
              formik={formikPerfTimelineControlFilter}
              name={'performanceFormCode'}
            />
            <InputDropdownRemote
              placeholder={'Position Name'}
              label={'Position Name'}
              name={'positionCode'}
              formik={formikPerfTimelineControlFilter}
              apiFetcher={getPositions}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'code'}
              apiFilter={{
                isActive: true,
                isRequiredAccessMapping,
                isValidAccess,
              }}
            />
              <Input
              placeholder={'Employee Name'}
              label={'Employee Name'}
              formik={formikPerfTimelineControlFilter}
              name={'employeeName'}
            />
              <DatePicker
              name={'year'}
              placeholder={new Date().getFullYear().toString()}
              label={'Program Year'}
              formik={formikPerfTimelineControlFilter}
              yearOnly
            />
            <Form.Field>
              <label>&nbsp;</label>
              <Popup
                trigger={
                  <Button
                    disabled={!formikPerfTimelineControlFilter.dirty}
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
              <Button floated="left" secondary type={'submit'}>
                Search
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        )}
          <Button
            size={'tiny'}
            floated="right"
            onClick={() => refreshPress()}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isPerfTimelineControlLoading || isPerfTimelineControlEmpty)
            }
            className={'nomargin'}
            color={'black'}
            singleLine
            compact
            style={{ width: '100%' }}
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'fullName'}
                  name={'Employee Name'}
                  direction={perfTimelineControlSort?.fullName}
                  onSortPress={perfTimelineControlSortPress as any}
                />
              
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'performanceFormCode'}
                  name={'Form Code'}
                  direction={perfTimelineControlSort?.performanceFormCode}
                  onSortPress={perfTimelineControlSortPress as any}
                />
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'perfFormName'}
                  name={'Form Name'}
                  direction={perfTimelineControlSort?.perfFormName}
                  onSortPress={perfTimelineControlSortPress as any}
                />
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'timeline'}
                  name={'Timeline Status'}
                  direction={perfTimelineControlSort?.timeline}
                  onSortPress={perfTimelineControlSortPress as any}
                />
                <TableHeaderCell
                  width={1}
                  sortable
                  attribute={'endDate'}
                  name={'End Date'}
                  direction={perfTimelineControlSort?.endDate}
                  onSortPress={perfTimelineControlSortPress as any}
                />
                <Table.HeaderCell
                  width={1}
                  collapsing
                  textAlign={'center'}
                ></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfTimelineControlLoading && (
                <TablePlaceholder rowCount={5} colCount={7} />
              )}
              {!isPerfTimelineControlLoading && isPerfTimelineControlEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerfTimelineControlError
                      ? isPerfTimelineControlError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfTimelineControlLoading &&
                perfTimelineControl?.map((data: any) => (
                  <Table.Row key={data.id}>
                    <Popup
                      content={
                        <List>{renderHyphen(data.employee?.fullName)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data.employee?.fullName)}
                        </Table.Cell>
                      }
                    />
                   
                    <Popup
                      content={
                        <List>
                          {renderHyphen(data.perfForm?.performanceFormCode)}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data.perfForm?.performanceFormCode)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>
                          {renderHyphen(data.perfForm?.perfFormName?.name)}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data.perfForm?.perfFormName?.name)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderEnum(data?.timelineSeq?.timeline)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderEnum(data?.timelineSeq?.timeline)}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell>
                      {renderDate(data.timelineSeq?.endDate)}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                          <Button
                            onClick={modalPerformanceDetailOpenPress(data)}
                            icon={'eye'}
                          />
                           <Button
                            onClick={modalPerformanceEditOpenPress(data)}
                            icon={'pencil'}
                          />
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfTimelineControlLoading && !isPerfTimelineControlEmpty && (
            <>
              Show <b>{perfTimelineControl?.length}</b> of{' '}
              <b>{perfTimelineControlTotalCount}</b> entries
              {perfTimelineControlTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfTimelineControlPagePress}
                  totalPage={perfTimelineControlTotalPage}
                  activePage={perfTimelineControlPage}
                  nextFivePagePress={perfTimelineControlNextFivePagePress}
                  prevFivePagePress={perfTimelineControlPrevFivePagePress}
                  firstPagePress={perfTimelineControlFirstPagePress}
                  lastPagePress={perfTimelineControlLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
      {isModalPerformanceEdit && (
        <ModalPerfTimelineControlEdit
          id={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
          ids={modalPerformanceEditData}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerfTimelineControlDetail
          id={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
          ids={modalPerformanceDetailData}
        />
      )}
    </>
  );
};

export default TableTimelineControl;
