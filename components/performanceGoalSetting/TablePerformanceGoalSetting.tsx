import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Icon,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import { useFormik } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import usePerfGoalSetting from '../../lib/data/performanceGoalSetting/usePerfGoalSettings';
import ModalPerformanceGoalSetting from './ModalPerformanceGoalSetting';
import InputDropdownRemote from '../InputDropdownRemote';
import { getPerfProgramList } from '../../lib/data/performanceForm/usePerfProgramList';
import { getPerfNameList } from '../../lib/data/performanceForm/usePerfNameList';
import renderHyphen from '../../lib/util/renderHyphen';
import InputField from '../Input';
import { isWtihinDateRange } from '../../lib/util/isWtihinDateRange';
import PerformanceFormStatusIcon from './components/PerformanceFormStatusIcon';
import {
  PFWorkflowTypeEnum,
  timelineEnum,
} from '../../lib/enums/PerformanceEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesProgramProps {
  showFilter?: boolean;
}

const TablePerformanceGoalSetting = ({
  showFilter = false,
}: TablePerformancesProgramProps) => {
  const now = new Date().getFullYear().toString();
  const formikPerformanceFilter = useFormik({
    initialValues: {
      perfProgram: '',
      formCode: '',
      perfFormName: '',
      timelineSeq: '',
      status: [],
      startDate: '',
      endDate: '',
      year: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        perfProgram: { id: values.perfProgram },
        perfForm: { performanceFormCode: values.formCode },
        perfFormName: { id: values.perfFormName },
        timelineSeq: {
          timeline: values.timelineSeq,
          startDate: values.startDate,
          endDate: values.endDate,
        },
        status: values.status,
        year: values.year,
        // goalSettingStatus: values.status,
        // year: values.year,
      };
      setPerfGoalSettingFilter(newFilter);
    },
    onReset: () => {
      setPerfGoalSettingFilter({ year: '' });
    },
  });

  const {
    perfGoalSetting,
    isPerfGoalSettingEmpty,
    isPerfGoalSettingLoading,
    isPerfGoalSettingError,
    perfGoalSettingTotalCount,
    perfGoalSettingTotalPage,
    perfGoalSettingPage,
    perfGoalSettingRefreshPress,
    perfGoalSettingPagePress,
    perfGoalSettingSort,
    perfGoalSettingSortPress,
    setPerfGoalSettingFilter,
    perfGoalSettingNextFivePagePress,
    perfGoalSettingPrevFivePagePress,
    perfGoalSettingFirstPagePress,
    perfGoalSettingLastPagePress,
  } = usePerfGoalSetting({ year: now });

  const [isModalPerfGoalSetting, setIsModalPerfGoalSetting] = useState(false);

  const [isOnViewDetail, setIsOnViewDetail] = useState<boolean | undefined>();
  const [modalPerfGoalSettingData, setModalPerfGoalSettingData] =
    useState<any>(null);

  // open goal setting modal
  const modalPerfGoalSettingOpenPress = useCallback(
    (perfGoalSetting, onViewDetail: boolean) => () => {
      setIsOnViewDetail(onViewDetail);
      setModalPerfGoalSettingData(perfGoalSetting.id);
      setIsModalPerfGoalSetting(true);
    },
    [],
  );

  // close goal setting modal
  const modalPerformanceProgramDetailClosePress = useCallback(() => {
    perfGoalSettingRefreshPress();
    setIsOnViewDetail(undefined);
    setIsModalPerfGoalSetting(false);
  }, [perfGoalSettingRefreshPress]);

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerformanceFilter.resetForm(),
    [formikPerformanceFilter],
  );

  const isOutdated = (data: any): boolean => {
    return isWtihinDateRange(
      new Date(),
      data?.timelineSeq?.startDate,
      data?.timelineSeq?.endDate,
    );
  };
  useEffect(() => {
    formikPerformanceFilter.setFieldValue('year', now);
    setPerfGoalSettingFilter({ year: now });
  }, []);
  return (
    <>
      <Segment  className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
         <Form onSubmit={formikPerformanceFilter.handleSubmit} style={{marginBottom: '10px'}}>
         <Form.Group widths={'equal'}>
           <InputDropdownRemote
             placeholder={'Performance Program Name'}
             label={'Performance Program Name'}
             name={'perfProgram'}
             formik={formikPerformanceFilter}
             apiFetcher={getPerfProgramList}
             apiSearchKeys={['name']}
             apiTextKey={'name'}
             apiValueKey={'id'}
           />
           <InputField
             value={formikPerformanceFilter.values.formCode}
             placeholder={'Performance Form Code'}
             label={'Performance Form Code'}
             formik={formikPerformanceFilter}
             name={'formCode'}
           />
           <InputDropdownRemote
             placeholder={'Performance Form Name'}
             label={'Performance Form Name'}
             name={'perfFormName'}
             formik={formikPerformanceFilter}
             apiFetcher={getPerfNameList}
             apiSearchKeys={['name']}
             apiTextKey={'name'}
             apiValueKey={'id'}
           />
           <Form.Field>
             <label>&nbsp;</label>
             <Popup
               trigger={
                 <Button
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
               size={'tiny'}
               floated="right"
               onClick={perfGoalSettingRefreshPress as any}
               basic
               icon
             >
               <Icon name="refresh" />
             </Button>
           </Form.Field>
         </Form.Group>
       </Form>
        )}
          <div className={'horizontal-scroll'}>
            <Table
              selectable={!(isPerfGoalSettingError || isPerfGoalSettingEmpty)}
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
                    attribute={'name'}
                    name={'Program Name'}
                    direction={perfGoalSettingSort?.name}
                    onSortPress={perfGoalSettingSortPress}
                  />
                  <TableHeaderCell
                    sortable
                    width={4}
                    attribute={'formCode'}
                    name={'Performance Form Code'}
                    direction={perfGoalSettingSort?.performanceFormCode}
                    onSortPress={perfGoalSettingSortPress as any}
                  />
                  <TableHeaderCell
                    sortable
                    width={4}
                    attribute={'perfFormName'}
                    name={'Performance Form Name'}
                    direction={perfGoalSettingSort?.perfFormName}
                    onSortPress={perfGoalSettingSortPress as any}
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
                {isPerfGoalSettingLoading && (
                  <TablePlaceholder rowCount={15} colCount={8} />
                )}
                {!isPerfGoalSettingLoading && isPerfGoalSettingEmpty && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={5}>
                      {isPerfGoalSettingError
                        ? isPerfGoalSettingError.response?.data?.message ||
                          'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isPerfGoalSettingLoading &&
                  perfGoalSetting?.map((goalSetting: any) => (
                    <Table.Row key={goalSetting?.id}>
                      <Popup
                        content={
                          <List>
                            {renderHyphen(
                              goalSetting?.perfForm?.perfProgram?.name,
                            )}
                          </List>
                        }
                        trigger={
                          <Table.Cell>
                            {renderHyphen(
                              goalSetting?.perfForm?.perfProgram?.name,
                            )}
                          </Table.Cell>
                        }
                      />
                      <Popup
                        content={
                          <List>
                            {renderHyphen(
                              goalSetting?.perfForm?.performanceFormCode,
                            )}
                          </List>
                        }
                        trigger={
                          <Table.Cell>
                            {renderHyphen(
                              goalSetting?.perfForm?.performanceFormCode,
                            )}
                          </Table.Cell>
                        }
                      />
                      <Popup
                        content={
                          <List>
                            {renderHyphen(
                              goalSetting?.perfForm?.perfFormName?.name,
                            )}
                          </List>
                        }
                        trigger={
                          <Table.Cell>
                            {renderHyphen(
                              goalSetting?.perfForm?.perfFormName?.name,
                            )}
                          </Table.Cell>
                        }
                      />
                      <Table.Cell textAlign={'center'}>
                        <Button.Group icon basic size="mini" compact>
                          <Button
                            onClick={modalPerfGoalSettingOpenPress(
                              goalSetting,
                              false,
                            )}
                            icon={'pencil'}
                          />
                            <Button
                            onClick={modalPerfGoalSettingOpenPress(
                              goalSetting,
                              true,
                            )}
                            icon={'eye'}
                          />
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </Segment>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfGoalSettingLoading && !isPerfGoalSettingEmpty && (
            <>
              Show <b>{perfGoalSetting?.length}</b> of{' '}
              <b>{perfGoalSettingTotalCount}</b> entries
              {perfGoalSettingTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfGoalSettingPagePress}
                  totalPage={perfGoalSettingTotalPage}
                  activePage={perfGoalSettingPage}
                  nextFivePagePress={perfGoalSettingNextFivePagePress}
                  prevFivePagePress={perfGoalSettingPrevFivePagePress}
                  firstPagePress={perfGoalSettingFirstPagePress}
                  lastPagePress={perfGoalSettingLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
      {isModalPerfGoalSetting && isOnViewDetail !== undefined && (
        <ModalPerformanceGoalSetting
          onViewDetail={isOnViewDetail}
          id={modalPerfGoalSettingData}
          isOpen={isModalPerfGoalSetting}
          closePress={modalPerformanceProgramDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformanceGoalSetting;
