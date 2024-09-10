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
import usePerformanceWorkflowEmployees from '../../lib/data/performanceWorkflowEmployee/usePerformanceWorkflowEmployees';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { groupBy, size } from 'lodash';
import Avatar from 'react-avatar';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import ModalPerformanceWorkflowEmployeeCreate from '../modal/PerformanceWorkflowEmployeeCreate';
import ModalPerformanceWorkflowEmployeeEdit from '../modal/PerformanceWorkflowEmployeeEdit';
import ModalPerformanceWorkflowEmployeeDetail from '../modal/PerformanceWorkflowEmployeeDetail';
import TablePaginationNew from '../TablePaginationNew';
interface TablePerformanceWorkflowEmployeeProps {
  showFilter?: boolean;
}

const TablePerformanceWorkflowEmployee = ({
  showFilter = false,
}: TablePerformanceWorkflowEmployeeProps) => {
  const formikPerformanceFilter = useFormik({
    initialValues: {
      code: '',
      fullName: '',
    },
    onSubmit: (values) => {
      setPerformanceWorkflowEmployeeFilter({
        ...values,
      });
    },
    onReset: () => {
      setPerformanceWorkflowEmployeeFilter({});
    },
  });

  const {
    performanceWorkflowEmployee,
    isPerformanceWorkflowEmployeeEmpty,
    isPerformanceWorkflowEmployeeLoading,
    performanceWorkflowEmployeeTotalCount,
    performanceWorkflowEmployeeTotalPage,
    setPerformanceWorkflowEmployeeFilter,
    performanceWorkflowEmployeeRefreshPress,
    performanceWorkflowEmployeePage,
    performanceWorkflowEmployeePagePress,
    performanceWorkflowEmployeeSort,
    performanceWorkflowEmployeeSortPress,
    isPerformanceWorkflowEmployeeError,
    isPerformanceWorkflowEmployeeSelectedAll,
    performanceWorkflowEmployeeDeletePress,
    performanceWorkflowEmployeeNextFivePagePress,
    performanceWorkflowEmployeePrevFivePagePress,
    performanceWorkflowEmployeeFirstPagePress,
    performanceWorkflowEmployeeLastPagePress,
  } = usePerformanceWorkflowEmployees();

  const [isModalDelete, setIsModalDelete] = useState(false);

  const [
    isModalPerformanceWorkflowEmployeeCreate,
    setIsModalPerformanceWorkflowEmployeeCreate,
  ] = useState(false);

  const [
    isModalPerformanceWorkfowEmployeeEdit,
    setIsModalPerformanceWorkfowEmployeeEdit,
  ] = useState(false);

  const [
    modalPerformanceWorkflowEmployeeEditData,
    setModalPerformanceWorkflowEmployeeEditData,
  ] = useState<any>(null);

  const [
    isModalPerformanceWorkfowEmployeeDetail,
    setIsModalPerformanceWorkfowEmployeeDetail,
  ] = useState(false);

  const [
    modalPerformanceWorkfowEmployeeDetailData,
    setModalPerformanceWorkfowEmployeeDetailData,
  ] = useState<any>(null);

  const [modalDeleteData, setModalDeleteData] = useState<string>();
  const [modalDeleteDataMap, setModalDeleteDataMap] = useState<string[]>([]);

  // Modal Detail
  const modalPerformanceWorkfowEmployeeDetailOpenPress = useCallback(
    (performanceWorkflowEmployee) => () => {
      setModalPerformanceWorkfowEmployeeDetailData(
        performanceWorkflowEmployee.id,
      );
      setIsModalPerformanceWorkfowEmployeeDetail(true);
    },
    [],
  );

  const modalPerformanceWorkfowEmployeeDetailClosePress = useCallback(() => {
    setIsModalPerformanceWorkfowEmployeeDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceWorkflowEmployeeCreateClosePress = useCallback(() => {
    performanceWorkflowEmployeeRefreshPress();
    setIsModalPerformanceWorkflowEmployeeCreate(false);
  }, [performanceWorkflowEmployeeRefreshPress]);

  const modalPerformanceWorkflowEmployeeCreateOpenPress = useCallback(() => {
    setIsModalPerformanceWorkflowEmployeeCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceWorkflowEmployeeCreateOpenPress();
  }, [modalPerformanceWorkflowEmployeeCreateOpenPress]);

  // Modal Edit
  const modalPerformanceWorkfowEmployeeEditClosePress = useCallback(() => {
    performanceWorkflowEmployeeRefreshPress();
    setIsModalPerformanceWorkfowEmployeeEdit(false);
  }, [performanceWorkflowEmployeeRefreshPress]);

  const modalPerformanceWorkfowEmployeeEditOpenPress = useCallback(
    (performanceWorkflowEmployee) => () => {
      setModalPerformanceWorkflowEmployeeEditData(
        performanceWorkflowEmployee.id,
      );
      setIsModalPerformanceWorkfowEmployeeEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData('');
    setModalDeleteDataMap([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performanceWorkflowEmployeeDeletePress(modalDeleteData);
    setIsModalDelete(false);
  }, [modalDeleteData, performanceWorkflowEmployeeDeletePress]);

  const deleteOnePress = useCallback(
    (performanceWorkfowEmployee) => () => {
      setModalDeleteData(performanceWorkfowEmployee.id);
      setModalDeleteDataMap([performanceWorkfowEmployee]);
      setIsModalDelete(true);
    },
    [],
  );

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerformanceFilter.resetForm(),
    [formikPerformanceFilter],
  );

  return (
    <>
      <Segment  className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
          <Form onSubmit={formikPerformanceFilter.handleSubmit}>
          <Form.Group widths={'equal'}>
            <Input
              value={formikPerformanceFilter.values.code}
              placeholder={'Code'}
              label={'Code'}
              formik={formikPerformanceFilter}
              name={'code'}
              fluid
            />
            <Input
              value={formikPerformanceFilter.values.fullName}
              placeholder={'Name'}
              label={'Name'}
              formik={formikPerformanceFilter}
              name={'fullName'}
              fluid
            />
            <Form.Field>
              <label>&nbsp;</label>
              <Popup
                trigger={
                  <Button
                    disabled={!formikPerformanceFilter.dirty}
                    type={'reset'}
                    onClick={formikPerformanceFilterResetPress}
                    floated="left"
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
              <Button floated="left" color={'black'} type={'submit'}>
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
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(
                isPerformanceWorkflowEmployeeLoading ||
                isPerformanceWorkflowEmployeeEmpty
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
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'code'}
                  name={'code'}
                  direction={performanceWorkflowEmployeeSort?.code}
                  onSortPress={performanceWorkflowEmployeeSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'fullName'}
                  name={'name'}
                  direction={performanceWorkflowEmployeeSort?.fullName}
                  onSortPress={performanceWorkflowEmployeeSortPress as any}
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
              {isPerformanceWorkflowEmployeeLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceWorkflowEmployeeLoading &&
                isPerformanceWorkflowEmployeeEmpty && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={5}>
                      {isPerformanceWorkflowEmployeeError
                        ? isPerformanceWorkflowEmployeeError.response?.data
                            ?.message || 'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
              {!isPerformanceWorkflowEmployeeLoading &&
                performanceWorkflowEmployee?.map(
                  (performanceWorkflowEmployee: any) => (
                    <Table.Row key={performanceWorkflowEmployee.id}>
                      <Table.Cell>
                        {renderHyphen(performanceWorkflowEmployee.code)}
                      </Table.Cell>
                      <Table.Cell>
                        {renderHyphen(performanceWorkflowEmployee.fullName)}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'}>
                        <Button.Group icon basic size="mini" compact>
                            <Button
                              onClick={modalPerformanceWorkfowEmployeeDetailOpenPress(
                                performanceWorkflowEmployee,
                              )}
                              icon={'eye'}
                            />
                              <Button
                              onClick={modalPerformanceWorkfowEmployeeEditOpenPress(
                                performanceWorkflowEmployee,
                              )}
                              icon={'pencil'}
                            />
                            <Button
                              onClick={deleteOnePress(
                                performanceWorkflowEmployee,
                              )}
                              icon={'trash'}
                            />
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerformanceWorkflowEmployeeLoading &&
            !isPerformanceWorkflowEmployeeEmpty && (
              <>
                Show <b>{performanceWorkflowEmployee?.length}</b> of{' '}
                <b>{performanceWorkflowEmployeeTotalCount}</b> entries
                {performanceWorkflowEmployeeTotalPage > 1 && (
                  <TablePaginationNew
                    pagePress={performanceWorkflowEmployeePagePress}
                    totalPage={performanceWorkflowEmployeeTotalPage}
                    activePage={performanceWorkflowEmployeePage}
                    nextFivePagePress={
                      performanceWorkflowEmployeeNextFivePagePress
                    }
                    prevFivePagePress={
                      performanceWorkflowEmployeePrevFivePagePress
                    }
                    firstPagePress={performanceWorkflowEmployeeFirstPagePress}
                    lastPagePress={performanceWorkflowEmployeeLastPagePress}
                  />
                )}
              </>
            )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>
             Remove Performance Process By Employee
            </span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to delete this data ?
            </span>
            {!isPerformanceWorkflowEmployeeSelectedAll && (
              <List
                selection
                verticalAlign="middle"
                celled
                style={{ marginLeft: '.5em' }}
              >
                {modalDeleteDataMap.map((data: any) => (
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
                            {data.code}
                          </List.Header>
                          {data.fullName}
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
      {isModalPerformanceWorkflowEmployeeCreate && (
        <ModalPerformanceWorkflowEmployeeCreate
          isOpen={isModalPerformanceWorkflowEmployeeCreate}
          closePress={modalPerformanceWorkflowEmployeeCreateClosePress}
        />
      )}
      {isModalPerformanceWorkfowEmployeeEdit && (
        <ModalPerformanceWorkflowEmployeeEdit
          id={modalPerformanceWorkflowEmployeeEditData}
          isOpen={isModalPerformanceWorkfowEmployeeEdit}
          closePress={modalPerformanceWorkfowEmployeeEditClosePress}
        />
      )}
      {isModalPerformanceWorkfowEmployeeDetail && (
        <ModalPerformanceWorkflowEmployeeDetail
          id={modalPerformanceWorkfowEmployeeDetailData}
          isOpen={isModalPerformanceWorkfowEmployeeDetail}
          closePress={modalPerformanceWorkfowEmployeeDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformanceWorkflowEmployee;
