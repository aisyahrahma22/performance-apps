import React, { useCallback, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Icon,
  List,
  Modal,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import Input from '../Input';
import renderHyphen from '../../lib/util/renderHyphen';
import { useFormik } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerfMeasurementFinalResultCreate from '../modal/PerfMeasurementFinalResultCreate';
import ModalPerfMeasurementFinalResultEdit from '../modal/PerfMeasurementFinalResultEditForm';
import ModalPerfMeasurementFinalResultDetail from '../modal/PerformanceMeasurementFinalResultDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import usePerfMeasurementFinalResult from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalResult';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesProps {
  showFilter?: boolean;
}

const TableMeasurementFinalResult = ({
  showFilter = false,
}: TablePerformancesProps) => {
  const formikPerformanceFilter = useFormik({
    initialValues: {
      measurementCode: '',
      measurementName: '',
      year: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        measurementCode: values.measurementCode,
        measurementName: values.measurementName,
        year: values.year,
      };
      setPerformanceMeasurementFinalFilter(newFilter);
    },
    onReset: () => {
      setPerformanceMeasurementFinalFilter({});
    },
  });

  const {
    performanceMeasurementFinal,
    isPerformanceMeasurementFinalEmpty,
    isPerformanceMeasurementFinalLoading,
    performanceMeasurementFinalTotalCount,
    performanceMeasurementFinalTotalPage,
    setPerformanceMeasurementFinalFilter,
    performanceMeasurementFinalRefreshPress,
    performanceMeasurementFinalPage,
    performanceMeasurementFinalPagePress,
    performanceMeasurementFinalSort,
    performanceMeasurementFinalSortPress,
    isPerformanceMeasurementFinalError,
    performanceMeasurementFinalSelectAllPress,
    performanceMeasurementFinalSelectOnePress,
    performanceMeasurementFinalSelected,
    isPerformanceMeasurementFinalSelectedAll,
    performanceMeasurementFinalDeletePress,
    performanceMeasurementFinalNextFivePagePress,
    performanceMeasurementFinalPrevFivePagePress,
    performanceMeasurementFinalFirstPagePress,
    performanceMeasurementFinalLastPagePress,
  } = usePerfMeasurementFinalResult();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalPerformanceDetail, setIsModalPerformanceDetail] =
    useState(false);
  const [isModalPerformanceCreate, setIsModalPerformanceCreate] =
    useState(false);
  const [isModalPerformanceEdit, setIsModalPerformanceEdit] = useState(false);
  const [modalPerformanceDetailData, setModalPerformanceDetailData] =
    useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalPerformanceEditData, setModalPerformanceEditData] =
    useState<any>(null);

  // Modal Detail
  const modalPerformanceDetailOpenPress = useCallback(
    (performance) => () => {
      setModalPerformanceDetailData(performance.id);
      setIsModalPerformanceDetail(true);
    },
    [],
  );

  const modalPerformanceDetailClosePress = useCallback(() => {
    setIsModalPerformanceDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceCreateClosePress = useCallback(() => {
    performanceMeasurementFinalRefreshPress();
    setIsModalPerformanceCreate(false);
  }, [performanceMeasurementFinalRefreshPress]);

  const modalPerformanceCreateOpenPress = useCallback(() => {
    setIsModalPerformanceCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceCreateOpenPress();
  }, [modalPerformanceCreateOpenPress]);

  // Modal Edit
  const modalPerformanceEditClosePress = useCallback(() => {
    performanceMeasurementFinalRefreshPress();
    setIsModalPerformanceEdit(false);
  }, [performanceMeasurementFinalRefreshPress]);

  const modalPerformanceEditOpenPress = useCallback(
    (Performance) => () => {
      setModalPerformanceEditData(Performance.id);
      setIsModalPerformanceEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performanceMeasurementFinalDeletePress(
      modalDeleteData.map((d: any) => d.id),
    );
    setIsModalDelete(false);
  }, [modalDeleteData, performanceMeasurementFinalDeletePress]);

  const deleteOnePress = useCallback(
    (performance) => () => {
      performanceMeasurementFinalSelectAllPress(false)();
      setModalDeleteData([performance]);
      setIsModalDelete(true);
    },
    [performanceMeasurementFinalSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceMeasurementFinalSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performanceMeasurementFinal, (u: any) =>
          includes(performanceMeasurementFinalSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [
    performanceMeasurementFinalSelected,
    performanceMeasurementFinal,
    isPerformanceMeasurementFinalSelectedAll,
  ]);

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerformanceFilter.resetForm(),
    [formikPerformanceFilter],
  );

  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
         <Form onSubmit={formikPerformanceFilter.handleSubmit}>
         <Form.Group widths={'equal'}>
           <Input
             value={formikPerformanceFilter.values.measurementCode}
             placeholder={'Measurement Code'}
             label={'Code'}
             formik={formikPerformanceFilter}
             name={'measurementCode'}
           />
           <Input
             value={formikPerformanceFilter.values.measurementName}
             placeholder={'Measurement Name'}
             label={'Name'}
             formik={formikPerformanceFilter}
             name={'measurementName'}
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
               size={'tiny'}
               floated="right"
               color={'black'}
               icon
               labelPosition={'right'}
               onClick={performanceCreatePress}
             >
               Create New
               <Icon name={'plus'} />
             </Button>
           </Form.Field>
         </Form.Group>
       </Form>
        )}
          {isPerformanceMeasurementFinalSelectedAll ||
          performanceMeasurementFinalSelected.length ? (
            <RenderGuard
              actionKey={RightEnum.MD_PERF_MEASUREMENT_FINAL_RESULT_DELETE}
            >
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceMeasurementFinalSelectedAll
                  ? performanceMeasurementFinalTotalCount
                  : performanceMeasurementFinalSelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(
                isPerformanceMeasurementFinalLoading ||
                isPerformanceMeasurementFinalEmpty
              )
            }
            className={'nomargin'}
            color={'black'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className={'nopadding'}
                  width={1}
                  collapsing
                  textAlign={'center'}
                >
                  <Icon
                    disabled={isPerformanceMeasurementFinalEmpty}
                    onClick={performanceMeasurementFinalSelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceMeasurementFinalSelectedAll
                        ? 'check square outline'
                        : performanceMeasurementFinalSelected.length > 0
                        ? 'minus square outline'
                        : 'square outline'
                    }
                  />
                </Table.HeaderCell>
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'measurementCode'}
                  name={'Code'}
                  direction={performanceMeasurementFinalSort?.measurementCode}
                  onSortPress={performanceMeasurementFinalSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'measurementName'}
                  name={'Name'}
                  direction={performanceMeasurementFinalSort?.measurementName}
                  onSortPress={performanceMeasurementFinalSortPress as any}
                />
                <TableHeaderCell
                  width={2}
                  sortable
                  attribute={'year'}
                  name={'Year'}
                  direction={performanceMeasurementFinalSort?.year}
                  onSortPress={performanceMeasurementFinalSortPress as any}
                />
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerformanceMeasurementFinalLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceMeasurementFinalLoading &&
                isPerformanceMeasurementFinalEmpty && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={5}>
                      {isPerformanceMeasurementFinalError
                        ? isPerformanceMeasurementFinalError.response?.data
                            ?.message || 'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
              {!isPerformanceMeasurementFinalLoading &&
                performanceMeasurementFinal?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceMeasurementFinalSelectOnePress(
                          performance.id,
                        )}
                        size={'large'}
                        name={
                          isPerformanceMeasurementFinalSelectedAll ||
                          includes(
                            performanceMeasurementFinalSelected,
                            performance.id,
                          )
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance.measurementCode)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance.measurementName)}
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(performance.year)}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <Button
                            onClick={modalPerformanceDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                           <Button
                            onClick={modalPerformanceEditOpenPress(performance)}
                            icon={'pencil'}
                          />
                           <Button
                            onClick={deleteOnePress(performance)}
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
          {!isPerformanceMeasurementFinalLoading &&
            !isPerformanceMeasurementFinalEmpty && (
              <>
                Show <b>{performanceMeasurementFinal?.length}</b> of{' '}
                <b>{performanceMeasurementFinalTotalCount}</b> entries
                {performanceMeasurementFinalTotalPage > 1 && (
                  <TablePaginationNew
                    pagePress={performanceMeasurementFinalPagePress}
                    totalPage={performanceMeasurementFinalTotalPage}
                    activePage={performanceMeasurementFinalPage}
                    nextFivePagePress={
                      performanceMeasurementFinalNextFivePagePress
                    }
                    prevFivePagePress={
                      performanceMeasurementFinalPrevFivePagePress
                    }
                    firstPagePress={performanceMeasurementFinalFirstPagePress}
                    lastPagePress={performanceMeasurementFinalLastPagePress}
                  />
                )}
              </>
            )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>
              Remove Final Result
            </span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceMeasurementFinalSelectedAll
                ? `ALL DATA with total ${performanceMeasurementFinalTotalCount}`
                : modalDeleteData.length > 1
                ? 'these datas'
                : 'this data'}
              ?
            </span>
            {!isPerformanceMeasurementFinalSelectedAll && (
              <List
                selection
                verticalAlign="middle"
                celled
                style={{ marginLeft: '.5em' }}
              >
                {modalDeleteData.map((data: any) => (
                  <List.Item
                    key={data.id}
                    style={{ padding: '.7em .5em', border: 0 }}
                  >
                    <Grid>
                      <Grid.Column
                        width={'ten'}
                        style={{ marginLeft: '.7em' }}
                        verticalAlign={'middle'}
                      >
                        <List.Content>
                          <List.Header style={{ marginBottom: '.3em' }}>
                            {data.measurementCode}
                          </List.Header>
                          {data.measurementName}
                        </List.Content>
                      </Grid.Column>
                    </Grid>
                  </List.Item>
                ))}
              </List>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Grid columns="equal">
              <Grid.Column>
                <Button fluid onClick={modalDeleteClosePress}>
                   No
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid secondary onClick={modalDeleteYesPress}>
                  Yes
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
      </Segment>
      {isModalPerformanceCreate && (
        <ModalPerfMeasurementFinalResultCreate
          isOpen={isModalPerformanceCreate}
          closePress={modalPerformanceCreateClosePress}
        />
      )}
      {isModalPerformanceEdit && (
        <ModalPerfMeasurementFinalResultEdit
          id={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerfMeasurementFinalResultDetail
          id={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
        />
      )}
    </>
  );
};

export default TableMeasurementFinalResult;
