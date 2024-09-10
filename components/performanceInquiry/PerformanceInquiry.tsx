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
import Input from '../Input';
import renderHyphen from '../../lib/util/renderHyphen';
import { useFormik } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
// import TablePagination from '../TablePagination';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import InputDropdownRemote from '../InputDropdownRemote';
import { getPerfNameList } from '../../lib/data/performanceForm/usePerfNameList';
import { perfEmployeeStatusList } from '../../lib/data/performanceForm/finalResult';
import usePerformanceInquiry from '../../lib/data/performanceInquiry/usePerformanceInquiry';
import renderDate from '../../lib/util/renderDate';
import ModalPerformanceInquiryDetail from './modals/PerformanceInquiryDetail';
import renderEnum from '../../lib/util/renderEnum';
import ModalPerformanceInquiryDelete from './modals/PerformanceInquiryDelete';
import { includes, remove } from 'lodash';
import useEmpHasDataAccess from '../../lib/data/dataAccessMapping/useEmpHasDataAccess';
import { getPerfProgramList } from '../../lib/data/performanceForm/usePerfProgramList';
import { toast } from 'react-toastify';
import {
  getPerformanceInquiryDownload,
  getPerformanceInquiryDownloadAll,
} from '../../lib/data/performanceInquiry/usePerformanceInquiryAbsoluteScoreDownload';
import ModalPerformanceInquiryDownloadAbsoluteScore from './modals/PerformanceInquiryDownloadAbsoluteScoreInput';
import usePerfGoalSettingNotes from '../../lib/data/performanceGoalSetting/usePerfGoalSettingNotes';
import DatePicker from '../DatePicker';
import { getPositions } from '../../lib/data/position/usePositions';
import { timelinesListOption } from '../../lib/data/perfMidYear/helpers/dropdownOptions';
import dateLabeling from '../../lib/util/dateLabeling';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesInquiryProps {
  showFilter?: boolean;
}

const initialValues = {
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
};

const TablePerformanceInquiry = ({
  showFilter = false,
}: TablePerformancesInquiryProps) => {
  const { isRequiredAccessMapping, isValidAccess } = useEmpHasDataAccess();
  const now = new Date().getFullYear().toString();
  const formikPerformanceFilter = useFormik({
    initialValues,
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
      setPerformanceInquiryFilter(newFilter);
    },
    onReset: () => {
      setPerformanceInquiryFilter({
        isValidAccess,
        isRequiredAccessMapping,
        year: '',
      });
    },
  });

  const {
    performancesInquiry,
    isPerformanceInquiryEmpty,
    isPerformanceInquiryLoading,
    isPerformanceInquiryError,
    performanceInquiryTotalCount,
    performanceInquiryTotalPage,
    performanceInquiryPage,
    performanceInquiryRefreshPress,
    performanceInquiryPagePress,
    performanceInquirySort,
    performanceInquirySortPress,
    setPerformanceInquiryFilter,
    performanceInquirySelectAllPress,
    performancesInquiryDeletePress,
    performancesInquiryNextFivePagePress,
    performancesInquiryPrevFivePagePress,
    performancesInquiryFirstPagePress,
    performancesInquiryLastPagePress,
  } = usePerformanceInquiry({
    isValidAccess,
    isRequiredAccessMapping,
    year: now,
  });

  const [selectedData, setSelectedData] = useState<any>([]);

  const [isSelectedAllData, setIsSelectedAllData] = useState(false);
  const [isSelectedOnePageData, setIsSelectedOnePageData] = useState(false);
  const [isModalPerformanceDetail, setIsModalPerformanceDetail] =
    useState(false);
  const [modalPerformanceDetailData, setModalPerformanceDetailData] =
    useState<any>(null);
  const [isModalPerformanceDelete, setIsModalPerformanceDelete] =
    useState(false);
  const [isModalPerformancDownload, setIsModalPerformanceDownload] =
    useState(false);
  const perfEmployeeId = performancesInquiry?.map((d: any) => d.id);
  const { perfGoalSettingNotesRefreshPress } = usePerfGoalSettingNotes({
    perfEmployeeId: perfEmployeeId,
  });

  // Modal Detail
  const modalPerformanceDetailOpenPress = useCallback(
    (performance) => () => {
      if (!performance.id) {
        return toast.error('Performance ID is missing! Please refresh table!');
      }
      setModalPerformanceDetailData(performance.id);
      performanceInquiryRefreshPress();
      setIsModalPerformanceDetail(true);
      perfGoalSettingNotesRefreshPress();
    },
    [perfGoalSettingNotesRefreshPress, performancesInquiry],
  );

  const modalPerformanceDetailClosePress = useCallback(() => {
    setIsModalPerformanceDetail(false);
  }, []);

  const formikPerformanceFilterResetPress = useCallback(() => {
    refreshPress();
    formikPerformanceFilter.resetForm();
  }, [formikPerformanceFilter]);

  // Modal Delete
  const deletePress = useCallback(
    (performance) => () => {
      setSelectedData([performance]);
      setIsModalPerformanceDelete(true);
    },
    [],
  );

  const deleteAllPress = useCallback(() => {
    if (isSelectedAllData) {
      performanceInquirySelectAllPress(true)();
    } else performanceInquirySelectAllPress(false)();
    setIsModalPerformanceDelete(true);
  }, [isSelectedAllData, performanceInquirySelectAllPress]);

  const modalPerformanceDeleteClosePress = useCallback(() => {
    // setSelectedData([]);
    setIsModalPerformanceDelete(false);
  }, []);

  const modalPerformanceDeleteYesPress = useCallback(() => {
    if (isSelectedAllData) {
      const values = formikPerformanceFilter.values;
      const currentFilter = {
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
      performancesInquiryDeletePress(currentFilter);
    } else performancesInquiryDeletePress(selectedData.map((v: any) => v.id));
    setIsModalPerformanceDelete(false);
  }, [
    formikPerformanceFilter.values,
    isRequiredAccessMapping,
    isSelectedAllData,
    isValidAccess,
    performancesInquiryDeletePress,
    selectedData,
  ]);

  const downloadAbsoluteScoreInput = useCallback(() => {
    setIsModalPerformanceDownload(true);
  }, []);

  const selectedAllDataPress = useCallback(() => {
    const tempData: any = [...selectedData];
    if (isSelectedAllData) {
      for (const value of performancesInquiry) {
        if (includes(tempData, value)) remove(tempData);
      }
    } else {
      for (const value of performancesInquiry) {
        if (!includes(tempData, value)) tempData.push(value);
      }
    }
    setIsSelectedOnePageData(false);
    setIsSelectedAllData(!isSelectedAllData);
    setSelectedData(tempData);
  }, [isSelectedAllData, performancesInquiry, selectedData]);

  const selectedOnlyThisPageDataPress = useCallback(() => {
    if (selectedData?.length == 0) {
      setIsSelectedOnePageData(true);
      setSelectedData(performancesInquiry);
    } else {
      for (const value of performancesInquiry) {
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
  }, [selectedData?.length, performancesInquiry]);

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

  const modalPerformanceDowloadClosePress = useCallback(() => {
    setIsModalPerformanceDownload((prev) => !prev);
  }, []);

  const modalPerformanceDowloadYesPress = useCallback(() => {
    if (isSelectedAllData) {
      const values = formikPerformanceFilter.values;
      const currentFilter = {
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
      getPerformanceInquiryDownloadAll(currentFilter);
    } else {
      getPerformanceInquiryDownload(selectedData.map((v: any) => v.id));
    }

    setIsModalPerformanceDownload((prev) => !prev);
  }, [
    formikPerformanceFilter.values,
    isRequiredAccessMapping,
    isSelectedAllData,
    isValidAccess,
    selectedData,
  ]);

  const refreshPress = useCallback(() => {
    setSelectedData([]);
    setIsSelectedAllData(false);
    performanceInquiryRefreshPress();
  }, [performanceInquiryRefreshPress]);
  useEffect(() => {
    formikPerformanceFilter.setFieldValue('year', now);
    setPerformanceInquiryFilter({
      year: now,
      isValidAccess,
      isRequiredAccessMapping,
    });
  }, []);

  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
          <Form onSubmit={formikPerformanceFilter.handleSubmit}>
            <Form.Group widths={'equal'}>
              <InputDropdownRemote
                placeholder={'Performance Form Name'}
                label={'Form Name'}
                name={'perfFormName'}
                formik={formikPerformanceFilter}
                apiFetcher={getPerfNameList}
                apiSearchKeys={['name']}
                apiTextKey={'name'}
                apiValueKey={'id'}
              />
              <Input
                placeholder={'Performance Form Code'}
                label={'Form Code'}
                formik={formikPerformanceFilter}
                name={'performanceFormCode'}
              />
              <Input
                placeholder={'Employee Name'}
                label={'Employee Name'}
                formik={formikPerformanceFilter}
                name={'employeeName'}
              />
                <DatePicker
                name={'year'}
                placeholder={new Date().getFullYear().toString()}
                label={'Program Year'}
                formik={formikPerformanceFilter}
                yearOnly
              />
              
              <Form.Field>
                <label>&nbsp;</label>
                <Popup
                  trigger={
                    <Button
                      disabled={!formikPerformanceFilter.dirty}
                      type={'reset'}
                      onClick={formikPerformanceFilterResetPress}
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
                  onClick={downloadAbsoluteScoreInput}
                  size={'tiny'}
                  color="blue"
                  icon
                  labelPosition={'right'}
                  disabled={selectedData?.length == 0}
                >
                  <Icon name={'download'} /> Download
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
          )}
          <Button
            size={'tiny'}
            floated="right"
            onClick={refreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isPerformanceInquiryLoading || isPerformanceInquiryEmpty)
            }
            className={'nomargin'}
            color={'black'}
            singleLine
            compact
            style={{ width: '100%' }}
          >
            <Table.Header>
              <Table.Row>
              <Table.HeaderCell
                  className={'nopadding'}
                  width={1}
                  collapsing
                  textAlign={'center'}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Icon
                      disabled={isPerformanceInquiryEmpty}
                      onClick={() => selectedAllDataPress()}
                      size={'large'}
                      name={
                        isSelectedAllData
                          ? 'check square outline'
                          : selectedData?.length > 0 || isSelectedOnePageData
                          ? 'minus square outline'
                          : 'square outline'
                      }
                    />
                    <Dropdown size="large">
                      <Dropdown.Menu>
                        <Dropdown.Item
                          text="All"
                          onClick={() => selectedAllDataPress()}
                        />
                        <Dropdown.Item
                          text="This Page Only"
                          onClick={() => selectedOnlyThisPageDataPress()}
                          disabled={isSelectedAllData}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Table.HeaderCell>
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'formCode'}
                  name={'Form Code'}
                  direction={performanceInquirySort?.formCode}
                  onSortPress={performanceInquirySortPress as any}
                />
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'perfFormName'}
                  name={'Form Name'}
                  direction={performanceInquirySort?.perfFormName}
                  onSortPress={performanceInquirySortPress as any}
                />
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'fullName'}
                  name={'Employee Name'}
                  direction={performanceInquirySort?.fullName}
                  onSortPress={performanceInquirySortPress as any}
                />
                <TableHeaderCell
                  width={1}
                  sortable
                  attribute={'startDate'}
                  name={'Timeline Period'}
                  direction={performanceInquirySort?.startDate}
                  onSortPress={performanceInquirySortPress as any}
                />
                <Table.HeaderCell
                  width={1}
                  collapsing
                  textAlign={'center'}
                ></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerformanceInquiryLoading && (
                <TablePlaceholder rowCount={5} colCount={10} />
              )}
              {!isPerformanceInquiryLoading && isPerformanceInquiryEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={8}>
                    {isPerformanceInquiryError
                      ? isPerformanceInquiryError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceInquiryLoading &&
                performancesInquiry?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                     <Table.Cell textAlign={'center'}>
                      <Icon
                        disabled={isSelectedAllData}
                        onClick={() => selectedDataPress(performance)}
                        size={'large'}
                        name={
                          isSelectedAllData ||
                          (isSelectedOnePageData &&
                            includes(selectedData, performance)) ||
                          includes(selectedData, performance)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Popup
                      content={
                        <List>
                          {renderHyphen(
                            performance.perfForm?.performanceFormCode,
                          )}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(
                            performance.perfForm?.performanceFormCode,
                          )}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>
                          {renderHyphen(
                            performance.perfForm?.perfFormName?.name,
                          )}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(
                            performance.perfForm?.perfFormName?.name,
                          )}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>
                          {renderHyphen(performance.employee?.fullName)}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(performance.employee?.fullName)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>
                          {renderHyphen(
                            `${renderDate(
                              performance.timelineSeq?.startDate,
                            )} - ${dateLabeling(
                              performance.timelineSeq?.endDate,
                            )}`,
                          )}
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(
                            `${renderDate(
                              performance.timelineSeq?.startDate,
                            )} - ${dateLabeling(
                              performance.timelineSeq?.endDate,
                            )}`,
                          )}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <Button
                            onClick={modalPerformanceDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                           <Button
                            onClick={deletePress(performance)}
                            icon={'trash'}
                          />
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerformanceInquiryLoading && !isPerformanceInquiryEmpty && (
            <>
              Show <b>{performancesInquiry?.length}</b> of&nbsp;
              <b>{performanceInquiryTotalCount}</b> entries
              {performanceInquiryTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceInquiryPagePress}
                  totalPage={performanceInquiryTotalPage}
                  activePage={performanceInquiryPage}
                  nextFivePagePress={performancesInquiryNextFivePagePress}
                  prevFivePagePress={performancesInquiryPrevFivePagePress}
                  firstPagePress={performancesInquiryFirstPagePress}
                  lastPagePress={performancesInquiryLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
      {isModalPerformanceDetail && (
        <ModalPerformanceInquiryDetail
          id={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
          paTeamRecord={false}
          isPARecord={false}
        />
      )}
      {isModalPerformanceDelete && (
        <ModalPerformanceInquiryDelete
          allCountData={performanceInquiryTotalCount}
          data={selectedData}
          isOpen={isModalPerformanceDelete}
          closePress={modalPerformanceDeleteClosePress}
          yesPress={modalPerformanceDeleteYesPress}
          isSelectedAllData={isSelectedAllData}
        />
      )}
        {isModalPerformancDownload && (
        <ModalPerformanceInquiryDownloadAbsoluteScore
          allCountData={performanceInquiryTotalCount}
          data={selectedData}
          isOpen={isModalPerformancDownload}
          closePress={modalPerformanceDowloadClosePress}
          yesPress={modalPerformanceDowloadYesPress}
          isSelectedAllData={isSelectedAllData}
        />
      )}
    </>
  );
};

export default TablePerformanceInquiry;
