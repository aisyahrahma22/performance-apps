import React, { useCallback, useState } from 'react';
import {
  Button,
  Dropdown,
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
import { filter, includes, remove } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceFormEdit from './ModalPerfFormEdit';
import InputDropdownRemote from '../InputDropdownRemote';
import ModalPerformanceFormCreate from './ModalPerfFormCreate';
import usePerformancesForm from '../../lib/data/performanceForm/usePerformancesForm';
import { getPerfNameList } from '../../lib/data/performanceForm/usePerfNameList';
import { finalResultList } from '../../lib/data/performanceForm/finalResult';
import ModalPerformanceFormDetail from './ModalPerfFormDetail';
import { getPerfProgramList } from '../../lib/data/performanceForm/usePerfProgramList';
import usePerfFormPublish from '../../lib/data/performanceForm/usePerformanceFormPublish';
import TablePaginationNew from '../TablePaginationNew';
import { toast } from 'react-toastify';
import {
  doSyncAllFormToDDG,
  doSyncFormToDDG,
} from '../../lib/data/performanceForm/useSyncFormToDDG';

interface TablePerformancesFormProps {
  showFilter?: boolean;
}

const TablePerformanceForm = ({
  showFilter = false,
}: TablePerformancesFormProps) => {
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
        perfFormName: {
          id: values.perfFormName,
        },
        performanceFormCode: values.performanceFormCode,
        finalResultCalc: values.finalResultCalc,
      };

      setPerformanceFormFilter(newFilter);
    },
    onReset: () => {
      setPerformanceFormFilter({});
    },
  });

  const {
    performancesForm,
    isPerformanceFormEmpty,
    isPerformanceFormLoading,
    performanceFormTotalCount,
    performanceFormTotalPage,
    setPerformanceFormFilter,
    performanceFormRefreshPress,
    performanceFormPage,
    performanceFormPagePress,
    performanceFormSort,
    performanceFormSortPress,
    isPerformanceFormError,
    performanceFormSelectAllPress,
    performanceFormSelected,
    isPerformanceFormSelectedAll,
    performanceFormsDeletePress,
    performanceFormNextFivePagePress,
    performanceFormPrevFivePagePress,
    performanceFormFirstPagePress,
    performanceFormLastPagePress,
  } = usePerformancesForm();

  // const [_isValidatePublish, setIsValidatePublish] = useState(false);
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

  const [selectedData, setSelectedData] = useState<any>([]);

  const [isSelectedAllData, setIsSelectedAllData] = useState(false);
  const [isSelectedOnePageData, setIsSelectedOnePageData] = useState(false);

  // Modal Detail
  const modalPerformanceDetailOpenPress = useCallback(
    (performance) => () => {
      const data = {
        id: performance?.id,
        formMember: performance?.perfProgram?.formMember,
      };
      setModalPerformanceDetailData(data);
      setIsModalPerformanceDetail(true);
    },
    [],
  );

  const modalPerformanceDetailClosePress = useCallback(() => {
    performanceFormRefreshPress();
    setIsModalPerformanceDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceCreateClosePress = useCallback(() => {
    performanceFormRefreshPress();
    setIsModalPerformanceCreate(false);
  }, [performanceFormRefreshPress]);

  const modalPerformanceCreateOpenPress = useCallback(() => {
    setIsModalPerformanceCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceCreateOpenPress();
  }, [modalPerformanceCreateOpenPress]);

  // Modal Edit
  const modalPerformanceEditClosePress = useCallback(() => {
    performanceFormRefreshPress();
    setIsModalPerformanceEdit(false);
  }, [performanceFormRefreshPress]);

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
    performanceFormsDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performanceFormsDeletePress]);

  const deleteOnePress = useCallback(
    (performanceForm) => () => {
      performanceFormSelectAllPress(false)();
      setModalDeleteData([performanceForm]);
      setIsModalDelete(true);
    },
    [performanceFormSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceFormSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesForm, (u: any) =>
          includes(performanceFormSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [performanceFormSelected, performancesForm, isPerformanceFormSelectedAll]);

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerformanceFilter.resetForm(),
    [formikPerformanceFilter],
  );

  // Modal Publish
  const [isModalPerfFormPublish, setIsModalPerfFormPublish] = useState(false);

  const perfFormPublishClosePress = useCallback(() => {
    performanceFormRefreshPress();
    setIsModalPerfFormPublish(false);
    setIsModalPerformanceEdit(false);
  }, [performanceFormRefreshPress]);

  const selectedAllDataPress = useCallback(() => {
    let tempData: any = [...selectedData];
    if (isSelectedAllData) {
      tempData = [];
    } else {
      for (const value of performancesForm) {
        if (!includes(tempData, value)) tempData.push(value);
      }
    }
    setIsSelectedOnePageData(false);
    setIsSelectedAllData(!isSelectedAllData);
    setSelectedData(tempData);
  }, [isSelectedAllData, performancesForm, selectedData]);

  const selectedOnlyThisPageDataPress = useCallback(() => {
    if (selectedData?.length == 0) {
      setIsSelectedOnePageData(true);
      setSelectedData(performancesForm);
    } else {
      for (const value of performancesForm) {
        const deletedValue: any = [];
        setSelectedData((data: any) => {
          let newData: any = [...data];
          const findVal = newData?.find((val: any) => val?.id === value?.id);
          if (findVal) {
            remove(newData, (n) => n === value);
            deletedValue.push(findVal);
          } else {
            newData.push(value);
          }
          newData = [...newData, ...deletedValue];
          setIsSelectedOnePageData(true);
          return newData;
        });
      }
    }
  }, [selectedData?.length, performancesForm]);

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

  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
          {showFilter && (
          <Segment raised>
            <Form onSubmit={formikPerformanceFilter.handleSubmit}>
              <Form.Group widths={'equal'}>
                <InputDropdownRemote
                  placeholder={'Insert Program Name'}
                  label={'Program Name'}
                  name={'perfProgram'}
                  formik={formikPerformanceFilter}
                  apiFetcher={getPerfProgramList}
                  apiSearchKeys={['name']}
                  apiTextKey={'name'}
                  apiValueKey={'id'}
                />
                <Input
                  placeholder={'Form Code'}
                  label={'Insert Form Code'}
                  formik={formikPerformanceFilter}
                  name={'performanceFormCode'}
                />
                <InputDropdownRemote
                  placeholder={'Form Name'}
                  label={'Insert Form Name'}
                  name={'perfFormName'}
                  formik={formikPerformanceFilter}
                  apiFilter={{ isActive: true, flag: '2' }}
                  apiFetcher={getPerfNameList}
                  apiSearchKeys={['name']}
                  apiTextKey={'name'}
                  apiValueKey={'id'}
                />
                <Input
                  placeholder={'Term of Final Result'}
                  label={'Term of Final Result'}
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
                  <Button floated="left" secondary type={'submit'}>
                    Search
                  </Button>
                  <Button
                    size={'tiny'}
                    floated="right"
                    onClick={performanceFormRefreshPress as any}
                    basic
                    icon
                  >
                  <Icon name="refresh" />
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
          </Segment>
        )}
          {isPerformanceFormSelectedAll || performanceFormSelected.length ? (
             <Button
             onClick={deleteAllPress}
             size={'tiny'}
             negative
             icon
             labelPosition={'left'}
           >
             Delete (
             {isPerformanceFormSelectedAll
               ? performanceFormTotalCount
               : performanceFormSelected.length}
             )
             <Icon name={'trash'} />
           </Button>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerformanceFormLoading || isPerformanceFormEmpty)}
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
                      disabled={isPerformanceFormEmpty}
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
                  width={4}
                  sortable
                  attribute={'name'}
                  name={'Program Name'}
                  direction={performanceFormSort?.name}
                  onSortPress={performanceFormSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'performanceFormCode'}
                  name={'Performance Form Code'}
                  direction={performanceFormSort?.performanceFormCode}
                  onSortPress={performanceFormSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'perfFormName'}
                  name={'Performance Form Name'}
                  direction={performanceFormSort?.perfFormName}
                  onSortPress={performanceFormSortPress as any}
                />
                <Table.HeaderCell width={3} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerformanceFormLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceFormLoading && isPerformanceFormEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceFormError
                      ? isPerformanceFormError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceFormLoading &&
                performancesForm?.map((performance: any) => (
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
                    <Table.Cell>
                      {renderHyphen(performance?.perfProgram?.name)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance?.performanceFormCode)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance?.perfFormName?.name)}
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
                            onClick={modalPerformanceEditOpenPress(
                              performance,
                            )}
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
          {!isPerformanceFormLoading && !isPerformanceFormEmpty && (
            <>
              Show <b>{performancesForm?.length}</b> of{' '}
              <b>{performanceFormTotalCount}</b> entries
              {performanceFormTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceFormPagePress}
                  totalPage={performanceFormTotalPage}
                  activePage={performanceFormPage}
                  nextFivePagePress={performanceFormNextFivePagePress}
                  prevFivePagePress={performanceFormPrevFivePagePress}
                  firstPagePress={performanceFormFirstPagePress}
                  lastPagePress={performanceFormLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>Remove Performance Review Form</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to delete{' '}
              {isPerformanceFormSelectedAll
                ? `ALL PERFORMANCE REVIEW FORM with total ${performanceFormTotalCount}`
                : modalDeleteData.length > 1
                ? 'these performance review form'
                : 'this performance review form'}
              ?
            </span>
            {!isPerformanceFormSelectedAll && (
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
                            {data?.performanceFormCode}
                          </List.Header>
                          {data?.perfFormName?.name}
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
        <ModalPerformanceFormCreate
          isOpen={isModalPerformanceCreate}
          closePress={modalPerformanceCreateClosePress}
        />
      )}
      {isModalPerformanceEdit && (
        <ModalPerformanceFormEdit
          id={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
          isPublish={isModalPerfFormPublish}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerformanceFormDetail
          data={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
          sync={false}
        />
      )}
    </>
  );
};

export default TablePerformanceForm;
