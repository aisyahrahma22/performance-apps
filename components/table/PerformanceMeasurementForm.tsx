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
import usePerformanceMeasurementForm from '../../lib/data/performanceMeasurementForm/usePerfMeasurementForm';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerfMeasurementCreate from '../modal/PerfMeasurementCreate';
import ModalPerfMeasurementEditForm from '../modal/PerfMeasurementEditForm';
import ModalPerformanceMeasurementDetail from '../modal/PerformanceMeasurementDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import InputDropdownRemote from '../InputDropdownRemote';
import { getPerfTypeList } from '../../lib/data/performanceForm/usePerfTypeList';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesProps {
  showFilter?: boolean;
}

const TablePerformanceMeasurementForm = ({
  showFilter = false,
}: TablePerformancesProps) => {
  const formikPerformanceFilter = useFormik({
    initialValues: {
      templateCode: '',
      templateName: '',
      performanceType: '',
      year: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        templateCode: values.templateCode,
        templateName: values.templateName,
        performanceType: { id: values.performanceType },
        year: Number(values.year),
      };
      setPerformanceMeasurementFormFilter(newFilter);
    },
    onReset: () => {
      setPerformanceMeasurementFormFilter({});
    },
  });

  const {
    performanceMeasurementForm,
    isPerformanceMeasurementFormEmpty,
    isPerformanceMeasurementFormLoading,
    performanceMeasurementFormTotalCount,
    performanceMeasurementFormTotalPage,
    setPerformanceMeasurementFormFilter,
    performanceMeasurementFormRefreshPress,
    performanceMeasurementFormPage,
    performanceMeasurementFormPagePress,
    performanceMeasurementFormSort,
    performanceMeasurementFormSortPress,
    isPerformanceMeasurementFormError,
    performanceMeasurementFormSelectAllPress,
    performanceMeasurementFormSelectOnePress,
    performanceMeasurementFormSelected,
    isPerformanceMeasurementFormSelectedAll,
    performanceMeasurementFormDeletePress,
    performanceMeasurementFormNextFivePagePress,
    performanceMeasurementFormPrevFivePagePress,
    performanceMeasurementFormFirstPagePress,
    performanceMeasurementFormLastPagePress,
  } = usePerformanceMeasurementForm();

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
    performanceMeasurementFormRefreshPress();
    setIsModalPerformanceCreate(false);
  }, [performanceMeasurementFormRefreshPress]);

  const modalPerformanceCreateOpenPress = useCallback(() => {
    setIsModalPerformanceCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceCreateOpenPress();
  }, [modalPerformanceCreateOpenPress]);

  // Modal Edit
  const modalPerformanceEditClosePress = useCallback(() => {
    performanceMeasurementFormRefreshPress();
    setIsModalPerformanceEdit(false);
  }, [performanceMeasurementFormRefreshPress]);

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
    performanceMeasurementFormDeletePress(
      modalDeleteData.map((d: any) => d.id),
    );
    setIsModalDelete(false);
  }, [modalDeleteData, performanceMeasurementFormDeletePress]);

  const deleteOnePress = useCallback(
    (performance) => () => {
      performanceMeasurementFormSelectAllPress(false)();
      setModalDeleteData([performance]);
      setIsModalDelete(true);
    },
    [performanceMeasurementFormSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceMeasurementFormSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performanceMeasurementForm, (u: any) =>
          includes(performanceMeasurementFormSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [
    performanceMeasurementFormSelected,
    performanceMeasurementForm,
    isPerformanceMeasurementFormSelectedAll,
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
             value={formikPerformanceFilter.values.templateCode}
             placeholder={'Measurement Code'}
             label={'Code'}
             formik={formikPerformanceFilter}
             name={'templateCode'}
           />
           <Input
             value={formikPerformanceFilter.values.templateName}
             placeholder={'Measurement Name'}
             label={'Name'}
             formik={formikPerformanceFilter}
             name={'templateName'}
           />
           <InputDropdownRemote
             value={formikPerformanceFilter.values.performanceType}
             placeholder={'Performance Form Type'}
             label={'Performance Type'}
             name={'performanceType'}
             formik={formikPerformanceFilter}
             apiFilter={{
               isActive: true,
             }}
             apiFetcher={getPerfTypeList}
             apiSearchKeys={['name']}
             apiTextKey={'name'}
             apiValueKey={'id'}
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
          {isPerformanceMeasurementFormSelectedAll ||
          performanceMeasurementFormSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERF_FORM_MEASUREMENT_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceMeasurementFormSelectedAll
                  ? performanceMeasurementFormTotalCount
                  : performanceMeasurementFormSelected.length}
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
                isPerformanceMeasurementFormLoading ||
                isPerformanceMeasurementFormEmpty
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
                    disabled={isPerformanceMeasurementFormEmpty}
                    onClick={performanceMeasurementFormSelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceMeasurementFormSelectedAll
                        ? 'check square outline'
                        : performanceMeasurementFormSelected.length > 0
                        ? 'minus square outline'
                        : 'square outline'
                    }
                  />
                </Table.HeaderCell>
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'templateCode'}
                  name={'Code'}
                  direction={performanceMeasurementFormSort?.templateCode}
                  onSortPress={performanceMeasurementFormSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'templateName'}
                  name={'Name'}
                  direction={performanceMeasurementFormSort?.templateName}
                  onSortPress={performanceMeasurementFormSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'performanceType'}
                  name={'Performance Type'}
                  direction={performanceMeasurementFormSort?.performanceType}
                  onSortPress={performanceMeasurementFormSortPress as any}
                />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerformanceMeasurementFormLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceMeasurementFormLoading &&
                isPerformanceMeasurementFormEmpty && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={5}>
                      {isPerformanceMeasurementFormError
                        ? isPerformanceMeasurementFormError.response?.data
                            ?.message || 'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
              {!isPerformanceMeasurementFormLoading &&
                performanceMeasurementForm?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceMeasurementFormSelectOnePress(
                          performance.id,
                        )}
                        size={'large'}
                        name={
                          isPerformanceMeasurementFormSelectedAll ||
                          includes(
                            performanceMeasurementFormSelected,
                            performance.id,
                          )
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance.templateCode)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance.templateName)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance?.performanceType?.name)}
                    </Table.Cell>
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
          {!isPerformanceMeasurementFormLoading &&
            !isPerformanceMeasurementFormEmpty && (
              <>
                Show <b>{performanceMeasurementForm?.length}</b> of{' '}
                <b>{performanceMeasurementFormTotalCount}</b> entries
                {performanceMeasurementFormTotalPage > 1 && (
                  <TablePaginationNew
                    pagePress={performanceMeasurementFormPagePress}
                    totalPage={performanceMeasurementFormTotalPage}
                    activePage={performanceMeasurementFormPage}
                    nextFivePagePress={
                      performanceMeasurementFormNextFivePagePress
                    }
                    prevFivePagePress={
                      performanceMeasurementFormPrevFivePagePress
                    }
                    firstPagePress={performanceMeasurementFormFirstPagePress}
                    lastPagePress={performanceMeasurementFormLastPagePress}
                  />
                )}
              </>
            )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>
              Remove Measurement Performance Form
            </span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceMeasurementFormSelectedAll
                ? `ALL DATA with total ${performanceMeasurementFormTotalCount}`
                : modalDeleteData.length > 1
                ? 'these data'
                : 'this data'}
              ?
            </span>
            {!isPerformanceMeasurementFormSelectedAll && (
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
                            {data.templateCode}
                          </List.Header>
                          {data.templateName}
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
        <ModalPerfMeasurementCreate
          isOpen={isModalPerformanceCreate}
          closePress={modalPerformanceCreateClosePress}
        />
      )}
      {isModalPerformanceEdit && (
        <ModalPerfMeasurementEditForm
          id={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerformanceMeasurementDetail
          id={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformanceMeasurementForm;
