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
import usePerformances from '../../lib/data/performance/usePerformances';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceCreate from '../modal/PerformanceCreate';
import ModalPerformanceEdit from '../modal/PerformanceEdit';
import ModalPerformanceDetail from '../modal/PerformanceDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesProps {
  showFilter?: boolean;
}

const TablePerformances = ({ showFilter = false }: TablePerformancesProps) => {
  const formikPerformanceFilter = useFormik({
    initialValues: {
      performanceCode: '',
      performanceName: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        code: values.performanceCode,
        name: values.performanceName,
      };
      setPerformanceFilter(newFilter);
    },
    onReset: () => {
      setPerformanceFilter({});
    },
  });

  const {
    performances,
    isPerformanceEmpty,
    isPerformanceLoading,
    performanceTotalCount,
    performanceTotalPage,
    setPerformanceFilter,
    performanceRefreshPress,
    performancePage,
    performancePagePress,
    performanceSort,
    performanceSortPress,
    isPerformanceError,
    performanceSelectAllPress,
    performanceSelectOnePress,
    performanceSelected,
    isPerformanceSelectedAll,
    performancesDeletePress,
    performanceNextFivePagePress,
    performancePrevFivePagePress,
    performanceFirstPagePress,
    performanceLastPagePress,
  } = usePerformances();

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
    performanceRefreshPress();
    setIsModalPerformanceCreate(false);
  }, [performanceRefreshPress]);

  const modalPerformanceCreateOpenPress = useCallback(() => {
    setIsModalPerformanceCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceCreateOpenPress();
  }, [modalPerformanceCreateOpenPress]);

  // Modal Edit
  const modalPerformanceEditClosePress = useCallback(() => {
    performanceRefreshPress();
    setIsModalPerformanceEdit(false);
  }, [performanceRefreshPress]);

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
    performancesDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesDeletePress]);

  const deleteOnePress = useCallback(
    (performance) => () => {
      performanceSelectAllPress(false)();
      setModalDeleteData([performance]);
      setIsModalDelete(true);
    },
    [performanceSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performances, (u: any) => includes(performanceSelected, u.id)),
      );
    setIsModalDelete(true);
  }, [performanceSelected, performances, isPerformanceSelectedAll]);

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerformanceFilter.resetForm(),
    [formikPerformanceFilter],
  );

  return (
    <>
      {showFilter && (
        <Segment raised>
          <Form onSubmit={formikPerformanceFilter.handleSubmit}>
            <Form.Group widths={'equal'}>
              <Input
                value={formikPerformanceFilter.values.performanceCode}
                placeholder={'Code'}
                label={'Code'}
                formik={formikPerformanceFilter}
                name={'performanceCode'}
              />
              <Input
                value={formikPerformanceFilter.values.performanceName}
                placeholder={'Name'}
                label={'Name'}
                formik={formikPerformanceFilter}
                name={'performanceName'}
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
          {isPerformanceSelectedAll || performanceSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERF_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceSelectedAll
                  ? performanceTotalCount
                  : performanceSelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
          <Button
            size={'tiny'}
            floated="right"
            onClick={performanceRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <RenderGuard actionKey={RightEnum.MD_PERF_CREATE}>
            <Button
              size={'tiny'}
              floated="right"
              color={'teal'}
              icon
              labelPosition={'right'}
              onClick={performanceCreatePress}
            >
              Create New
              <Icon name={'plus'} />
            </Button>
          </RenderGuard>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerformanceLoading || isPerformanceEmpty)}
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
                  width={1}
                  collapsing
                  textAlign={'center'}
                >
                  <Icon
                    disabled={isPerformanceEmpty}
                    onClick={performanceSelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceSelectedAll
                        ? 'check square outline'
                        : performanceSelected.length > 0
                        ? 'minus square outline'
                        : 'square outline'
                    }
                  />
                </Table.HeaderCell>
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'code'}
                  name={'Code'}
                  direction={performanceSort?.code}
                  onSortPress={performanceSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'name'}
                  name={'Name'}
                  direction={performanceSort?.name}
                  onSortPress={performanceSortPress as any}
                />
                <TableHeaderCell
                  width={5}
                  sortable
                  attribute={'description'}
                  name={'Description'}
                  direction={performanceSort?.description}
                  onSortPress={performanceSortPress as any}
                />
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerformanceLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceLoading && isPerformanceEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceError
                      ? isPerformanceError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceLoading &&
                performances?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceSelectOnePress(performance.id)}
                        size={'large'}
                        name={
                          isPerformanceSelectedAll ||
                          includes(performanceSelected, performance.id)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(performance.code)}</Table.Cell>
                    <Table.Cell>{renderHyphen(performance.name)}</Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performance.description)}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <RenderGuard actionKey={RightEnum.MD_PERF_VIEW}>
                          <Button
                            onClick={modalPerformanceDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                        </RenderGuard>
                        <RenderGuard actionKey={RightEnum.MD_PERF_EDIT}>
                          <Button
                            onClick={modalPerformanceEditOpenPress(performance)}
                            icon={'pencil'}
                          />
                        </RenderGuard>
                        <RenderGuard actionKey={RightEnum.MD_PERF_DELETE}>
                          <Button
                            onClick={deleteOnePress(performance)}
                            icon={'trash'}
                          />
                        </RenderGuard>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerformanceLoading && !isPerformanceEmpty && (
            <>
              Show <b>{performances?.length}</b> of{' '}
              <b>{performanceTotalCount}</b> entries
              {performanceTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performancePagePress}
                  totalPage={performanceTotalPage}
                  activePage={performancePage}
                  nextFivePagePress={performanceNextFivePagePress}
                  prevFivePagePress={performancePrevFivePagePress}
                  firstPagePress={performanceFirstPagePress}
                  lastPagePress={performanceLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'teal'} />
            <span style={{ marginLeft: '.7em' }}>
              Delete Performance Assessment
            </span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to delete{' '}
              {isPerformanceSelectedAll
                ? `ALL PERFORMANCE with total ${performanceTotalCount}`
                : modalDeleteData.length > 1
                ? 'these performances'
                : 'this performance'}
              ?
            </span>
            {!isPerformanceSelectedAll && (
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
                            {data.code}
                          </List.Header>
                          {data.name}
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
      {isModalPerformanceCreate && (
        <ModalPerformanceCreate
          isOpen={isModalPerformanceCreate}
          closePress={modalPerformanceCreateClosePress}
        />
      )}
      {isModalPerformanceEdit && (
        <ModalPerformanceEdit
          id={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerformanceDetail
          id={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformances;
