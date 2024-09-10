import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  Button,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import { getDownloadReport } from '../lib/data/report/useDownloadReport';
import {
  ReportProgressStatusEnum,
  ReportProgressTypeDataEnum,
  ReportProgressTypeEnum,
} from '../lib/enums/Report';
import { resetSlicer, slicerStateSelector } from '../lib/slice/dashboard';
import { getName } from '../lib/util/getName';
import Slicer from './Slicer';
import { UploadProgressStatusIcon } from './UploadProgress';
import { performanceReportOptionsDropdown } from '../helper/performanceReport';
import usePerfMonitoringReport from '../lib/data/report/usePerfMonitoringReport';
import useListApproverPAReport from '../lib/data/report/useListApproverPAReport';
import useEmpHasDataAccess from '../lib/data/dataAccessMapping/useEmpHasDataAccess';
import usePerfKPIScoreReport from '../lib/data/report/usePerfKPIScoreReport';
import usePerfFinalEvalReport from '../lib/data/report/usePerfFinalEval';
import usePAFormByEmpReport from '../lib/data/report/usePAFormByEmpReport';
import useReportProgressPagination from '../lib/data/report/useReportProgressPagination';
import TablePlaceholder from './placeholder/TablePlaceholder';
// import { toast } from 'react-toastify';
import { calculateElapsedTime } from '../lib/util/calculateElapsedTime';
import useStopProgressReport from '../lib/data/report/useStopProgressReport';
import { isEnableStopReport } from '../lib/util/isEnableStopReport';
import useSocket, { SocketContext } from '../lib/hooks/useSocket';
import TablePaginationNew from './TablePaginationNew';

const PerformanceReport = () => {
  const slicerState = useSelector(slicerStateSelector);
  const [reportType, setReportType] = useState('');
  const [isGeneratingReport, setGeneratingReport] = useState(false);
  const {
    reportProgress,
    isReportProgressEmpty,
    isReportProgressLoading,
    reportProgressTotalCount,
    reportProgressTotalPage,
    reportProgressRefreshPress,
    reportProgressPage,
    reportProgressPagePress,
    isReportProgressError,
    reportProgressNextFivePagePress,
    reportProgressPrevFivePagePress,
    reportProgressFirstPagePress,
    reportProgressLastPagePress,
  } = useReportProgressPagination();

  const _onChange = useCallback(
    (_e, { value }) => {
      setReportType(value);
    },
    [setReportType],
  );
  const onButtonDelayPress = () => {
    reportProgressRefreshPress();
    setGeneratingReport(false);
  };

  const { fetchPerfMonitoringReport } = usePerfMonitoringReport({
    onSuccess: reportProgressRefreshPress,
  });

  const { fetchListApproverPAReport } = useListApproverPAReport({
    onSuccess: reportProgressRefreshPress,
  });

  const { fetchPerfKPIScoreReport } = usePerfKPIScoreReport({
    onSuccess: onButtonDelayPress,
    onError: onButtonDelayPress,
  });

  const { fetchPerfFinalEvalReport } = usePerfFinalEvalReport({
    onSuccess: reportProgressRefreshPress,
  });

  const { fetchPAFormByEmpReport } = usePAFormByEmpReport({
    onSuccess: reportProgressRefreshPress,
  });

  const { stopProgressReport, isStopProgressReportLoading } =
    useStopProgressReport({
      onSuccess: reportProgressRefreshPress,
    });

  const [activeIndex, setActiveIndex] = useState('filter');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [options, setOptions] = useState(performanceReportOptionsDropdown);
  const [searchDropdown, setSearchDropdown] = useState('');
  const dispatch = useDispatch();
  // const { positionCode: dataAccessPosition, isValidAccess } =
  //   usePosEmpDataAccessMapping();
  const { isRequiredAccessMapping, isValidAccess } = useEmpHasDataAccess();
  const accordionPress = (code: any) => {
    setActiveIndex((p) => (p === code ? null : code));
  };

  const [generatedReport, setGeneratedReport] = useState<string[]>([]);

  const onGenerateReport = () => {
    switch (reportType) {
      case `${ReportProgressTypeEnum.PERF_MONITORING}.${ReportProgressTypeDataEnum.XLSX}`:
        setGeneratedReport([...generatedReport, reportType]);
        fetchPerfMonitoringReport(slicerState, reportType);
        break;
      case `${ReportProgressTypeEnum.PERF_APPROVER_PA}.${ReportProgressTypeDataEnum.XLSX}`:
        setGeneratedReport([...generatedReport, reportType]);
        fetchListApproverPAReport(slicerState, reportType);
        break;
      case `${ReportProgressTypeEnum.PERF_KPI_SCORE}.${ReportProgressTypeDataEnum.XLSX}`:
        setGeneratedReport([...generatedReport, reportType]);
        fetchPerfKPIScoreReport(slicerState, reportType);
        setGeneratingReport(true);
        break;
      case `${ReportProgressTypeEnum.PERF_FINAL_EVAL}.${ReportProgressTypeDataEnum.XLSX}`:
        fetchPerfFinalEvalReport(slicerState, reportType);
        break;
      case `${ReportProgressTypeEnum.PA_FORM_BY_EMP}.${ReportProgressTypeDataEnum.XLSX}`:
        fetchPAFormByEmpReport(slicerState, reportType);
        break;
      default:
        onButtonDelayPress();
    }
  };

  const onDownloadReport = async (id: string) => {
    await getDownloadReport(id);
  };

  const onStopReport = (id: string) => {
    stopProgressReport(id);
  };

  const onResetSlicer = () => {
    dispatch(
      resetSlicer({
        isValidAccess,
        isRequiredAccessMapping,
      }),
    );
    setReportType('');
  };

  const onSearchChange = useCallback((_e, { value }) => {
    setSearchDropdown(value);
  }, []);

  // UNTUK SEARCH DROPDOWN DARI PERFORMANCE
  useEffect(() => {
    const filterOpt = performanceReportOptionsDropdown?.filter((opt) =>
      opt.text?.toLowerCase()?.includes(searchDropdown?.toLowerCase()),
    );
    setOptions(filterOpt);
  }, [searchDropdown]);

  const [progressPerformanceReport, setProgressPerformanceReport] = useState({
    filename: '',
    percent: 0,
  });

  // console.log('generatedReport', generatedReport)
  const progressCb = useCallback(
    (data: any) => {
      const batch = data?.data?.batch;
      const totalBatch = data?.data?.totalBatch;
      let percent = 0;
      percent = parseFloat(((batch / totalBatch) * 100).toFixed(2));
      if (percent == 100) {
        if (reportType == 'PERF_MONITORING') {
          const perfMonitoringIndex = generatedReport.indexOf(reportType);
          generatedReport.splice(perfMonitoringIndex, 1);
          reportProgressRefreshPress();
        }

        if (reportType == 'PERF_APPROVER_PA') {
          const perfPAReportIndex = generatedReport.indexOf(reportType);
          generatedReport.splice(perfPAReportIndex, 1);
          reportProgressRefreshPress();
        }
      }
      const result = {
        filename: data.fileName,
        percent: percent,
      };
      setProgressPerformanceReport(result);
    },
    [reportProgressRefreshPress, setProgressPerformanceReport],
  );

  const context =
    reportType == 'PERF_MONITORING'
      ? SocketContext.REPORT_MONITORING
      : SocketContext.PERF_APPROVER_PA;
  useSocket(context, progressCb);

  return (
    <>
      <Accordion>
        <Accordion.Title active={activeIndex === 'filter'} index={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Header
              as="h2"
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => accordionPress('filter')}
            >
              <Image src="icons/ic_filter.svg" avatar size="medium" />
              <Header.Content>Filter Data</Header.Content>
              <Icon name="dropdown" />
            </Header>
          </div>
          <Divider />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'filter'}>
          {reportType == 'PA_FORM_BY_EMP.XLSX' ? (
            <Slicer
              showStatusPerf
              showPerfName
              showEmpName
              showPerfTerm
              showPerfCode
              showTermScore
              showEmpStatus
            />
          ) : (
            <Slicer
              showStatusPerf
              showPerfName
              showEmpName
              showPerfTerm
              showPerfCode
              showEmpStatus
            />
          )}
        </Accordion.Content>
      </Accordion>
      <Segment>
        <Grid style={{ padding: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Dropdown
                placeholder="Choose Report"
                fluid
                value={reportType}
                options={performanceReportOptionsDropdown}
                onFocus={() => setOpenDropdown(true)}
                onBlur={() => setOpenDropdown(false)}
                icon={
                  <div style={{ alignSelf: 'center' }}>
                    <Image
                      src={
                        openDropdown
                          ? '/icons/icChevronUp.svg'
                          : '/icons/icChevronDown.svg'
                      }
                      width="90%"
                    />
                  </div>
                }
                style={{
                  border: `1px solid ${openDropdown ? 'blue' : 'grey'}`,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  height: '50px',
                  padding: '0 1em',
                  justifyContent: 'space-between',
                }}
              >
                <Dropdown.Menu
                  open={openDropdown}
                  style={{ width: '100%', margin: '0.5em 0' }}
                >
                  <Input
                    icon="search"
                    placeholder={'Search'}
                    value={searchDropdown}
                    iconPosition="left"
                    className="search"
                    onChange={onSearchChange}
                    style={{ margin: '16px' }}
                  />
                  <Dropdown.Menu
                    scrolling
                    style={{
                      border: 0,
                      padding: '0 16px',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {options?.map((opt) => (
                      <Dropdown.Item
                        {...opt}
                        key={opt.key}
                        onClick={_onChange}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Menu>
              </Dropdown>
            </Grid.Column>
            <Grid.Column>
              <Button
                fluid
                color={'black'}
                style={{ borderRadius: '4px', height: '50px' }}
                onClick={onGenerateReport}
                loading={isGeneratingReport ? true : false}
                disabled={isGeneratingReport ? true : false}
              >
                Generate
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div>
        <List relaxed selection divided>
            <List.Item style={{ paddingLeft: 0 }}>
              <List.Content floated="right" verticalAlign="middle">
                <Button
                  color={'red'}
                  inverted
                  icon={'refresh'}
                  loading={isReportProgressLoading}
                  onClick={reportProgressRefreshPress}
                  size="tiny"
                />
              </List.Content>
              <List.Content>
                <Header as={'h3'} style={{ marginTop: '10px' }}>
                  {' '}
                  Download Report
                </Header>
              </List.Content>
            </List.Item>
          </List>
        </div>
        <div>
          <Table
            selectable={!isReportProgressLoading}
            className={'nomargin'}
            singleLine
            compact
            fixed
          >
            <Table.Body>
              {isReportProgressLoading && (
                <TablePlaceholder rowCount={5} colCount={5} />
              )}
              {!isReportProgressLoading && isReportProgressEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={4}>
                    {isReportProgressError
                      ? isReportProgressError?.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isReportProgressLoading &&
                reportProgress?.map((rp: any) => (
                  <Table.Row key={rp?.id}>
                    <Popup
                      content={
                        <List>
                          <List.Item>
                            <List.Content>
                              <List.Header
                                as="a"
                                className="list-header-report"
                              >
                                {rp?.filename}
                              </List.Header>
                              <List.Description as="a">
                                {rp?.error}
                              </List.Description>
                            </List.Content>
                          </List.Item>
                        </List>
                      }
                      trigger={
                        <Table.Cell width={7}>
                          <List>
                            <List.Item>
                              <UploadProgressStatusIcon
                                data={rp}
                                isList
                                size={'large'}
                              />
                              <List.Content>
                                <List.Header
                                  as="a"
                                  className="list-header-report"
                                >
                                  {rp?.filename}
                                </List.Header>
                                <List.Description as="a">
                                  Begin at{' '}
                                  {format(
                                    new Date(rp?.createdAt),
                                    'dd-MM-yyyy HH:mm:ss',
                                  )}{' '}
                                  by {getName(rp?.createdBy)}
                                </List.Description>
                              </List.Content>
                            </List.Item>
                          </List>
                        </Table.Cell>
                      }
                      offset={[0, 10]}
                      position="top center"
                      wide
                    />
                    <Table.Cell textAlign="center">
                      <Button
                        color={'blue'}
                        inverted
                        icon={'download'}
                        onClick={() => onDownloadReport(rp?.id)}
                        disabled={
                          rp?.status !== ReportProgressStatusEnum.FINISHED
                        }
                        size="large"
                      />
                      {isEnableStopReport(rp?.type) && (
                        <Button
                          color={'green'}
                          inverted
                          icon={'stop'}
                          onClick={() => onStopReport(rp?.id)}
                          disabled={
                            rp?.status !==
                              ReportProgressStatusEnum.PROCESSING ||
                            isStopProgressReportLoading
                          }
                          size="large"
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isReportProgressLoading && !isReportProgressEmpty && (
            <>
              Showing <b>{reportProgress?.length}</b> of{' '}
              <b>{reportProgressTotalCount}</b> entries
              {reportProgressTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={reportProgressPagePress}
                  totalPage={reportProgressTotalPage}
                  activePage={reportProgressPage}
                  nextFivePagePress={reportProgressNextFivePagePress}
                  prevFivePagePress={reportProgressPrevFivePagePress}
                  firstPagePress={reportProgressFirstPagePress}
                  lastPagePress={reportProgressLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
    </>
  );
};

export default PerformanceReport;
