import React, { useCallback, useState } from 'react';
import {
  Label,
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
// import usePerformancesSiloamValue from '../../lib/data/performanceSiloamValue/usePerformancesSiloamValue';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import usePerformancesSiloamValues from '../../lib/data/performanceSiloamValue/usePerformancesSiloamValues';
import ModalSiloamValueCreate from '../modal/PerformanceSiloamValueCreate';
import ModalSiloamValueEdit from '../modal/PerformanceSiloamValueEdit';
import ModalSiloamValueDetail from '../modal/PerformanceSiloamValueDetail';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesSiloamValueProps {
  showFilter?: boolean;
}

const TablePerformancesSiloamValue = ({
  showFilter = false,
}: TablePerformancesSiloamValueProps) => {
  const formikSiloamValueFilter = useFormik({
    initialValues: {
      id: '',
      name: '',
      description: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        id: values.id,
        name: values.name,
        description: values.description,
      };
      performanceSiloamValues.setPerformanceSiloamValueFilter(newFilter);
    },
    onReset: () => {
      performanceSiloamValues.setPerformanceSiloamValueFilter({});
    },
  });

  const performanceSiloamValues = usePerformancesSiloamValues();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [
    isModalPerformanceSiloamValueDetail,
    setIsModalPerformanceSiloamValueDetail,
  ] = useState(false);
  const [
    isModalPerformanceSiloamValueCreate,
    setIsModalPerformanceSiloamValueCreate,
  ] = useState(false);
  const [
    isModalPerformanceSiloamValueEdit,
    setIsModalPerformanceSiloamValueEdit,
  ] = useState(false);
  const [
    modalPerformanceSiloamValueDetailData,
    setModalPerformanceSiloamValueDetailData,
  ] = useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [
    modalPerformanceSiloamValueEditData,
    setModalPerformanceSiloamValueEditData,
  ] = useState<any>(null);

  // Modal Detail
  const modalPerformanceSiloamValueDetailOpenPress = useCallback(
    (performanceSiloamValue) => () => {
      setModalPerformanceSiloamValueDetailData(performanceSiloamValue.id);
      setIsModalPerformanceSiloamValueDetail(true);
    },
    [],
  );

  const modalPerformanceSiloamValueDetailClosePress = useCallback(() => {
    setIsModalPerformanceSiloamValueDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceSiloamValueCreateClosePress = useCallback(() => {
    performanceSiloamValues.performanceSiloamValueRefreshPress();
    setIsModalPerformanceSiloamValueCreate(false);
  }, [performanceSiloamValues]);

  const modalPerformanceSiloamValueCreateOpenPress = useCallback(() => {
    setIsModalPerformanceSiloamValueCreate(true);
  }, []);

  const siloamValueCreatePress = useCallback(() => {
    modalPerformanceSiloamValueCreateOpenPress();
  }, [modalPerformanceSiloamValueCreateOpenPress]);

  // Modal Edit
  const modalPerformanceSiloamValueEditClosePress = useCallback(() => {
    performanceSiloamValues.performanceSiloamValueRefreshPress();
    setIsModalPerformanceSiloamValueEdit(false);
  }, [performanceSiloamValues]);

  const modalPerformanceSiloamValueEditOpenPress = useCallback(
    (PerformanceSiloamValue) => () => {
      setModalPerformanceSiloamValueEditData(PerformanceSiloamValue.id);
      setIsModalPerformanceSiloamValueEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performanceSiloamValues.performancesSiloamValueDeletePress(
      modalDeleteData.map((d: any) => d.id),
    );
    setIsModalDelete(false);
  }, [modalDeleteData, performanceSiloamValues]);

  const deleteOnePress = useCallback(
    (performanceSiloamValue) => () => {
      performanceSiloamValues.performanceSiloamValueSelectAllPress(false)();
      setModalDeleteData([performanceSiloamValue]);
      setIsModalDelete(true);
    },
    [performanceSiloamValues],
  );

  const deleteAllPress = useCallback(() => {
    if (performanceSiloamValues.isPerformanceSiloamValueSelectedAll)
      setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performanceSiloamValues.performancesSiloamValue, (u: any) =>
          includes(
            performanceSiloamValues.performanceSiloamValueSelected,
            u.id,
          ),
        ),
      );
    setIsModalDelete(true);
  }, [performanceSiloamValues]);

  const formikSiloamValueFilterResetPress = useCallback(
    () => formikSiloamValueFilter.resetForm(),
    [formikSiloamValueFilter],
  );

  return (
    <>
      {showFilter && (
        <Segment raised>
          <Form onSubmit={formikSiloamValueFilter.handleSubmit}>
            <Form.Group widths={'equal'}>
              <Input
                value={formikSiloamValueFilter.values.id}
                placeholder={'Code'}
                label={'Code'}
                formik={formikSiloamValueFilter}
                name={'id'}
                fluid
              />
              <Input
                value={formikSiloamValueFilter.values.name}
                placeholder={'Name'}
                label={'Name'}
                formik={formikSiloamValueFilter}
                name={'name'}
                fluid
              />
              <Input
                value={formikSiloamValueFilter.values.description}
                placeholder={'Description'}
                label={'Description'}
                formik={formikSiloamValueFilter}
                name={'description'}
                fluid
              />
              <Form.Field>
                <label>&nbsp;</label>
                <Popup
                  trigger={
                    <Button
                      disabled={!formikSiloamValueFilter.dirty}
                      type={'reset'}
                      onClick={formikSiloamValueFilterResetPress}
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
                <Button floated="right" primary type={'submit'}>
                  Search
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
      )}
      <Segment raised className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
          {performanceSiloamValues.isPerformanceSiloamValueSelectedAll ||
          performanceSiloamValues.performanceSiloamValueSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_SILOAM_VALUE_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {performanceSiloamValues.isPerformanceSiloamValueSelectedAll
                  ? performanceSiloamValues.performanceSiloamValueTotalCount
                  : performanceSiloamValues.performanceSiloamValueSelected
                      .length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
          <Button
            size={'tiny'}
            floated="right"
            onClick={
              performanceSiloamValues.performanceSiloamValueRefreshPress as any
            }
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <RenderGuard actionKey={RightEnum.MD_SILOAM_VALUE_CREATE}>
            <Button
              size={'tiny'}
              floated="right"
              color={'teal'}
              icon
              labelPosition={'right'}
              onClick={siloamValueCreatePress}
            >
              Create New
              <Icon name={'plus'} />
            </Button>
          </RenderGuard>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(
                performanceSiloamValues.isPerformanceSiloamValueLoading ||
                performanceSiloamValues.isPerformanceSiloamValueEmpty
              )
            }
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className={'nopadding'}
                  width={2}
                  collapsing
                  textAlign={'center'}
                >
                  <Icon
                    disabled={
                      performanceSiloamValues.isPerformanceSiloamValueEmpty
                    }
                    onClick={performanceSiloamValues.performanceSiloamValueSelectAllPress()}
                    size={'large'}
                    name={
                      performanceSiloamValues.isPerformanceSiloamValueSelectedAll
                        ? 'check square outline'
                        : performanceSiloamValues.performanceSiloamValueSelected
                            .length > 0
                        ? 'minus square outline'
                        : 'square outline'
                    }
                  />
                </Table.HeaderCell>
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'id'}
                  name={'Code'}
                  direction={
                    performanceSiloamValues.performanceSiloamValueSort?.id
                  }
                  onSortPress={
                    performanceSiloamValues.performanceSiloamValueSortPress as any
                  }
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'name'}
                  name={'Name'}
                  direction={
                    performanceSiloamValues.performanceSiloamValueSort?.name
                  }
                  onSortPress={
                    performanceSiloamValues.performanceSiloamValueSortPress as any
                  }
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'description'}
                  name={'Description'}
                  direction={
                    performanceSiloamValues.performanceSiloamValueSort
                      ?.description
                  }
                  onSortPress={
                    performanceSiloamValues.performanceSiloamValueSortPress as any
                  }
                />
                <Table.HeaderCell
                  className={'nopadding'}
                  width={4}
                  collapsing
                  textAlign={'center'}
                ></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {performanceSiloamValues.isPerformanceSiloamValueLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!performanceSiloamValues.isPerformanceSiloamValueLoading &&
                performanceSiloamValues.isPerformanceSiloamValueEmpty && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={5}>
                      {performanceSiloamValues.isPerformanceSiloamValueError
                        ? performanceSiloamValues.isPerformanceSiloamValueError
                            .response?.data?.message || 'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
              {!performanceSiloamValues.isPerformanceSiloamValueLoading &&
                performanceSiloamValues.performancesSiloamValue?.map(
                  (siloamValue: any) => (
                    <Table.Row key={siloamValue.id}>
                      <Table.Cell textAlign={'center'}>
                        <Icon
                          onClick={performanceSiloamValues.performanceSiloamValueSelectOnePress(
                            siloamValue.id,
                          )}
                          size={'large'}
                          name={
                            performanceSiloamValues.isPerformanceSiloamValueSelectedAll ||
                            includes(
                              performanceSiloamValues.performanceSiloamValueSelected,
                              siloamValue.id,
                            )
                              ? 'check square outline'
                              : 'square outline'
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>{renderHyphen(siloamValue.id)}</Table.Cell>
                      <Table.Cell>{renderHyphen(siloamValue.name)}</Table.Cell>
                      <Popup
                        content={
                          <List>
                            <Label>
                              {renderHyphen(siloamValue.description)}
                            </Label>
                          </List>
                        }
                        trigger={
                          <Table.Cell>
                            {renderHyphen(siloamValue.description)}
                          </Table.Cell>
                        }
                      />
                      <Table.Cell textAlign={'center'}>
                        <Button.Group icon basic size="mini" compact>
                          <RenderGuard
                            actionKey={RightEnum.MD_SILOAM_VALUE_VIEW}
                          >
                            <Button
                              onClick={modalPerformanceSiloamValueDetailOpenPress(
                                siloamValue,
                              )}
                              icon={'eye'}
                            />
                          </RenderGuard>
                          <RenderGuard
                            actionKey={RightEnum.MD_SILOAM_VALUE_EDIT}
                          >
                            <Button
                              onClick={modalPerformanceSiloamValueEditOpenPress(
                                siloamValue,
                              )}
                              icon={'pencil'}
                            />
                          </RenderGuard>
                          <RenderGuard
                            actionKey={RightEnum.MD_SILOAM_VALUE_DELETE}
                          >
                            <Button
                              onClick={deleteOnePress(siloamValue)}
                              icon={'trash'}
                            />
                          </RenderGuard>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!performanceSiloamValues.isPerformanceSiloamValueLoading &&
            !performanceSiloamValues.isPerformanceSiloamValueEmpty && (
              <>
                Show{' '}
                <b>{performanceSiloamValues.performancesSiloamValue?.length}</b>{' '}
                of{' '}
                <b>
                  {performanceSiloamValues.performanceSiloamValueTotalCount}
                </b>{' '}
                entries
                {performanceSiloamValues.performanceSiloamValueTotalPage >
                  1 && (
                  <TablePaginationNew
                    pagePress={
                      performanceSiloamValues.performanceSiloamValuePagePress
                    }
                    totalPage={
                      performanceSiloamValues.performanceSiloamValueTotalPage
                    }
                    activePage={
                      performanceSiloamValues.performanceSiloamValuePage
                    }
                    nextFivePagePress={
                      performanceSiloamValues.performanceSiloamValueNextFivePagePress
                    }
                    prevFivePagePress={
                      performanceSiloamValues.performanceSiloamValuePrevFivePagePress
                    }
                    firstPagePress={
                      performanceSiloamValues.performanceSiloamValueFirstPagePress
                    }
                    lastPagePress={
                      performanceSiloamValues.performanceSiloamValueLastPagePress
                    }
                  />
                )}
              </>
            )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'teal'} />
            <span style={{ marginLeft: '.7em' }}>Delete Siloam Value</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to delete{' '}
              {performanceSiloamValues.isPerformanceSiloamValueSelectedAll
                ? `ALL Siloam Value with total ${performanceSiloamValues.performanceSiloamValueTotalCount}`
                : modalDeleteData.length > 1
                ? 'these Siloam Value'
                : 'this Siloam Value'}
              ?
            </span>
            {!performanceSiloamValues.isPerformanceSiloamValueSelectedAll && (
              <List
                selection
                verticalAlign="middle"
                celled
                style={{ marginLeft: '.5em' }}
              >
                {modalDeleteData.map((data: any) => (
                  <List.Item
                    key={data.code}
                    style={{ padding: '.7em .5em', border: 0 }}
                  >
                    <Grid>
                      <Grid.Column width={'one'} verticalAlign={'middle'}>
                        <Avatar
                          className={'avatar'}
                          size={'30'}
                          round
                          name={data.code}
                        />
                      </Grid.Column>
                      <Grid.Column
                        width={'ten'}
                        style={{ marginLeft: '.7em' }}
                        verticalAlign={'middle'}
                      >
                        <List.Content>
                          <List.Header style={{ marginBottom: '.3em' }}>
                            {data.name}
                          </List.Header>
                          {data.description}
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
                  <Icon name="remove" /> No
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid primary onClick={modalDeleteYesPress}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
      </Segment>
      {isModalPerformanceSiloamValueCreate && (
        <ModalSiloamValueCreate
          isOpen={isModalPerformanceSiloamValueCreate}
          closePress={modalPerformanceSiloamValueCreateClosePress}
        />
      )}
      {isModalPerformanceSiloamValueEdit && (
        <ModalSiloamValueEdit
          id={modalPerformanceSiloamValueEditData}
          isOpen={isModalPerformanceSiloamValueEdit}
          closePress={modalPerformanceSiloamValueEditClosePress}
        />
      )}
      {isModalPerformanceSiloamValueDetail && (
        <ModalSiloamValueDetail
          id={modalPerformanceSiloamValueDetailData}
          isOpen={isModalPerformanceSiloamValueDetail}
          closePress={modalPerformanceSiloamValueDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformancesSiloamValue;
