import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Icon,
  List,
  Popup,
  Progress,
  Segment,
  Table,
} from 'semantic-ui-react';
import ModalPerformanceFormDetail from '../../components/performanceForm/ModalPerfFormDetail';
import renderHyphen from '../../lib/util/renderHyphen';
import { useFormik } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { includes, remove } from 'lodash';
import InputDropdownRemote from '../InputDropdownRemote';
import { getPerfNameList } from '../../lib/data/performanceForm/usePerfNameList';
import Input from '../Input';
import { getPerfProgramList } from '../../lib/data/performanceForm/usePerfProgramList';
import { finalResultList } from '../../lib/data/performanceForm/finalResult';
import ModalPerfWorkflowMultipleSync from '../modal/PerfWorkflowMultipleSync';
import { Dropdown } from 'semantic-ui-react';
import ModalPerfWorkflowOneSync from '../modal/PerfWorkflowOneSync';
import usePerfFormSyncWF from '../../lib/data/performanceForm/usePerfFormSyncWF';
import TablePaginationNew from '../TablePaginationNew';

interface TableSyncPerformanceWorkflowProps {
  showFilter?: boolean;
}

export const dataProgressFunc = (item: any) => {
  const batch = item.batch;
  const totalBatch = item.totalBatch;
  let percent = 0;
  percent = parseFloat(((batch / totalBatch) * 100).toFixed(2));
  const result = {
    progressName: item?.dataProgress?.progressName,
    percent: percent,
  };

  return (
    <Progress
      percent={result?.percent}
      size="small"
      inverted
      progress
      color="green"
      active
      style={{
        background: '#E4E5E6',
        borderRadius: '16px',
        marginTop: '20px',
      }}
    ></Progress>
  );
};

const TableSyncPerformanceWorkflow = ({
  showFilter = false,
}: TableSyncPerformanceWorkflowProps) => {
  const {
    perfFormSyncWF,
    isPerfFormSyncWFEmpty,
    isPerfFormSyncWFLoading,
    perfFormSyncWFTotalCount,
    perfFormSyncWFTotalPage,
    setPerfFormSyncWFFilter,
    perfFormSyncWFRefreshPress,
    perfFormSyncWFPage,
    perfFormSyncWFPagePress,
    perfFormSyncWFSort,
    perfFormSyncWFSortPress,
    isPerfFormSyncWFError,
    perfFormSyncWFNextFivePagePress,
    perfFormSyncWFPrevFivePagePress,
    perfFormSyncWFFirstPagePress,
    perfFormSyncWFLastPagePress,
  } = usePerfFormSyncWF();
  const [filterData, setFilterData] = useState<any>([]);

  const formikPerformanceFilter = useFormik({
    initialValues: {
      perfProgram: '',
      performanceFormCode: '',
      perfFormName: '',
      perfType: '',
      finalResultCalc: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        perfProgram: { id: values.perfProgram },
        performanceFormCode: values.performanceFormCode,
        perfFormName: { id: values.perfFormName },
        finalResultCalc: values.finalResultCalc,
      };
      setFilterData(newFilter);
      setPerfFormSyncWFFilter(newFilter);
    },
    onReset: () => {
      setPerfFormSyncWFFilter({});
    },
  });

  const [selectedData, setSelectedData] = useState<any>([]);
  const [isSelectedAllData, setIsSelectedAllData] = useState(false);
  const [isSelectedOnePageData, setIsSelectedOnePageData] = useState(false);
  const [isModalPerformanceDetail, setIsModalPerformanceDetail] =
    useState(false);
  const [isModalPerformanceEdit, setIsModalPerformanceEdit] = useState(false);
  const [modalPerformanceDetailData, setModalPerformanceDetailData] =
    useState<any>(null);
  const [modalPerformanceEditData, setModalPerformanceEditData] = useState<
    string[]
  >([]);

  const [isModalMultiple, setIsModalMultiple] = useState(false);

  // Modal Detail
  const modalPerformanceDetailOpenPress = useCallback(
    (perfTimelineControl) => () => {
      const data = {
        id: perfTimelineControl.id,
        formMember: perfTimelineControl?.perfProgram?.formMember,
      };
      setModalPerformanceDetailData(data);
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
    perfFormSyncWFRefreshPress();
    setModalPerformanceEditData([]);
    setIsModalPerformanceEdit(false);
    setSelectedData([]);
  }, [perfFormSyncWFRefreshPress]);

  const modalPerformanceEditOpenPress = useCallback(
    (perfTimelineControl) => () => {
      setModalPerformanceEditData([perfTimelineControl]);
      setIsModalPerformanceEdit(true);
    },
    [],
  );

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerformanceFilter.resetForm(),
    [formikPerformanceFilter],
  );

  const multipleDataPress = useCallback(() => {
    setIsModalMultiple(true);
  }, []);

  const selectedAllDataPress = useCallback(() => {
    const tempData: any = [...selectedData];
    if (isSelectedAllData) {
      for (const value of perfFormSyncWF) {
        if (includes(tempData, value)) remove(tempData, (n) => n === value);
      }
    } else {
      for (const value of perfFormSyncWF) {
        if (!includes(tempData, value)) tempData.push(value);
      }
    }
    setIsSelectedOnePageData(false);
    setIsSelectedAllData(!isSelectedAllData);
    setSelectedData(tempData);
  }, [isSelectedAllData, selectedData, perfFormSyncWF]);

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

  const modalMultipleClosePress = useCallback(() => {
    setIsModalMultiple(false);
    perfFormSyncWFRefreshPress();
  }, [perfFormSyncWFRefreshPress]);

  const modalMultipleYesPress = useCallback(() => {
    perfFormSyncWFRefreshPress();
  }, [perfFormSyncWFRefreshPress]);

  const refreshPress = useCallback(() => {
    setSelectedData([]);
    setIsSelectedAllData(false);
    perfFormSyncWFRefreshPress();
  }, [perfFormSyncWFRefreshPress]);

  const selectedOnlyThisPageDataPress = useCallback(() => {
    if (selectedData?.length == 0) {
      setIsSelectedOnePageData(true);
      setSelectedData(perfFormSyncWF);
    } else {
      for (const value of perfFormSyncWF) {
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
  }, [perfFormSyncWF, selectedData, isSelectedOnePageData]);

  useEffect(() => {
    if (!isPerfFormSyncWFLoading) {
      for (const value of perfFormSyncWF) {
        if (value.dataProgress) {
          const batch = value.dataProgress?.batch;
          const totalBatch = value.dataProgress?.totalBatch;
          let percent = 0;
          percent = parseFloat(((batch / totalBatch) * 100).toFixed(2));
          if (percent == 100) perfFormSyncWFRefreshPress();
        }
      }
    }
  }, [perfFormSyncWF, perfFormSyncWFRefreshPress]);

  return (
    <>
      {showFilter && (
        <Segment raised>
          <Form onSubmit={formikPerformanceFilter.handleSubmit}>
            <Form.Group widths={'equal'}>
              <InputDropdownRemote
                placeholder={'Program Name'}
                label={'Performance Program Name'}
                name={'perfProgram'}
                formik={formikPerformanceFilter}
                apiFetcher={getPerfProgramList}
                apiSearchKeys={['name']}
                apiTextKey={'name'}
                apiValueKey={'id'}
              />
              <Input
                placeholder={'Performance Form Code'}
                label={'Performance Form Code'}
                formik={formikPerformanceFilter}
                name={'performanceFormCode'}
              />
              <InputDropdownRemote
                placeholder={'Performance Form Name'}
                label={'Performance Form Name'}
                name={'perfFormName'}
                formik={formikPerformanceFilter}
                apiFilter={{ isActive: true, flag: '2' }}
                apiFetcher={getPerfNameList}
                apiSearchKeys={['name']}
                apiTextKey={'name'}
                apiValueKey={'id'}
              />
              <Input
                placeholder={'Final Result Term'}
                label={'Final Result Term'}
                name={'finalResultCalc'}
                formik={formikPerformanceFilter}
                select
                options={finalResultList}
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
                <Button floated="right" color={'violet'} type={'submit'}>
                  Search
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
      )}
      <Segment raised className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={() => refreshPress()}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          {isSelectedAllData || selectedData?.length > 0 ? (
            <RenderGuard actionKey={RightEnum.PERF_TIMELINE_CTRL_EDIT}>
              <Button
                size={'small'}
                icon
                floated="right"
                labelPosition={'right'}
                color={'purple'}
                onClick={multipleDataPress}
                // disabled={!isSelectedAllData && selectedData.length == 0}
              >
                Sync Workflow (
                {isSelectedAllData
                  ? perfFormSyncWFTotalCount
                  : selectedData?.length}
                )
                <Icon name={'refresh'} rotated="clockwise" />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerfFormSyncWFLoading || isPerfFormSyncWFEmpty)}
            className={'nomargin width-table-150'}
            color={'teal'}
            singleLine
            compact
            // style={{ width: '150%' }}
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
                      disabled={isPerfFormSyncWFEmpty}
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
                  width={3}
                  sortable
                  attribute={'name'}
                  name={'Program Name'}
                  direction={perfFormSyncWFSort?.name}
                  onSortPress={perfFormSyncWFSortPress as any}
                  className={'margin'}
                />
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'performanceFormCode'}
                  name={'Performance Form Code'}
                  direction={perfFormSyncWFSort?.performanceFormCode}
                  onSortPress={perfFormSyncWFSortPress as any}
                  className={'margin'}
                />
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'perfFormName'}
                  name={'Performance Form Name'}
                  direction={perfFormSyncWFSort?.perfFormName}
                  onSortPress={perfFormSyncWFSortPress as any}
                  className={'margin'}
                />
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'finalResultCalc'}
                  name={'Final Result Term'}
                  direction={perfFormSyncWFSort?.finalResultCalc}
                  onSortPress={perfFormSyncWFSortPress as any}
                  className={'margin'}
                />
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'perfFormType'}
                  name={'Progress'}
                  direction={perfFormSyncWFSort?.perfFormType}
                  onSortPress={perfFormSyncWFSortPress as any}
                  className={'margin'}
                />
                <Table.HeaderCell
                  width={1}
                  collapsing
                  textAlign={'center'}
                ></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfFormSyncWFLoading && (
                <TablePlaceholder rowCount={5} colCount={7} />
              )}
              {!isPerfFormSyncWFLoading && isPerfFormSyncWFEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerfFormSyncWFError
                      ? isPerfFormSyncWFError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfFormSyncWFLoading &&
                perfFormSyncWF?.map((data: any) => (
                  <Table.Row key={data.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        disabled={isSelectedAllData}
                        onClick={() => selectedDataPress(data)}
                        size={'large'}
                        name={
                          isSelectedAllData ||
                          (isSelectedOnePageData &&
                            includes(selectedData, data)) ||
                          includes(selectedData, data)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Popup
                      content={
                        <List>{renderHyphen(data.perfProgram?.name)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data.perfProgram?.name)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderHyphen(data.performanceFormCode)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data.performanceFormCode)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderHyphen(data.perfFormName?.name)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data.perfFormName?.name)}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell>
                      {data?.finalResultCalc == 'USE_LAST_TERM' ? (
                        <>Use Last Term</>
                      ) : (
                        <>Average</>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {data?.dataProgress?.type == 'SYNC_FORM_WF' ? (
                        dataProgressFunc(data?.dataProgress)
                      ) : (
                        <Progress
                          percent={0}
                          size="small"
                          inverted
                          progress
                          color="green"
                          active
                          style={{
                            background: '#E4E5E6',
                            borderRadius: '16px',
                            marginTop: '20px',
                          }}
                        ></Progress>
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <RenderGuard actionKey={RightEnum.MD_PERF_VIEW}>
                          <Button
                            onClick={modalPerformanceDetailOpenPress(data)}
                            icon={'eye'}
                          />
                        </RenderGuard>
                        <RenderGuard actionKey={RightEnum.MD_PERF_EDIT}>
                          <Button
                            size={'tiny'}
                            floated="right"
                            basic
                            icon
                            onClick={modalPerformanceEditOpenPress(data)}
                            disabled={isSelectedAllData}
                          >
                            <Icon name="refresh" rotated="clockwise" />
                          </Button>
                        </RenderGuard>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfFormSyncWFLoading && !isPerfFormSyncWFEmpty && (
            <>
              Show <b>{perfFormSyncWF?.length}</b> of{' '}
              <b>{perfFormSyncWFTotalCount}</b> entries
              {perfFormSyncWFTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfFormSyncWFPagePress}
                  totalPage={perfFormSyncWFTotalPage}
                  activePage={perfFormSyncWFPage}
                  nextFivePagePress={perfFormSyncWFNextFivePagePress}
                  prevFivePagePress={perfFormSyncWFPrevFivePagePress}
                  firstPagePress={perfFormSyncWFFirstPagePress}
                  lastPagePress={perfFormSyncWFLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
      {isModalMultiple && (
        <ModalPerfWorkflowMultipleSync
          dataSelected={selectedData}
          isOpen={isModalMultiple}
          closePress={modalMultipleClosePress}
          selectedAll={isSelectedAllData}
          dataAll={perfFormSyncWF}
          multipleClosePress={modalMultipleClosePress}
          multipleYesPress={modalMultipleYesPress}
          performanceFormTotalCount={perfFormSyncWFTotalCount}
          filter={filterData}
        />
      )}
      {isModalPerformanceEdit && (
        <ModalPerfWorkflowOneSync
          data={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerformanceFormDetail
          data={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
          sync={true}
        />
      )}
    </>
  );
};

export default TableSyncPerformanceWorkflow;
