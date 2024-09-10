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
import usePerformancesKRA from '../../lib/data/performanceKRA/usePerformancesKRA';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceKRACreate from '../modal/PerformanceKRACreate';
import ModalPerformanceKRAEdit from '../modal/PerformanceKRAEdit';
import ModalPerformanceKRADetail from '../modal/PerformanceKRADetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesKRAProps {
  showFilter?: boolean;
}

const TablePerformancesKRA = ({
  showFilter = false,
}: TablePerformancesKRAProps) => {
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
      setPerformanceKRAFilter(newFilter);
    },
    onReset: () => {
      setPerformanceKRAFilter({});
    },
  });

  const {
    performancesKRA,
    isPerformanceKRAEmpty,
    isPerformanceKRALoading,
    performanceKRATotalCount,
    performanceKRATotalPage,
    setPerformanceKRAFilter,
    performanceKRARefreshPress,
    performanceKRAPage,
    performanceKRAPagePress,
    performanceKRASort,
    performanceKRASortPress,
    isPerformanceKRAError,
    performanceKRASelectAllPress,
    performanceKRASelectOnePress,
    performanceKRASelected,
    isPerformanceKRASelectedAll,
    performancesKRADeletePress,
    performanceKRANextFivePagePress,
    performanceKRAPrevFivePagePress,
    performanceKRAFirstPagePress,
    performanceKRALastPagePress,
  } = usePerformancesKRA();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalPerformanceKRADetail, setIsModalPerformanceKRADetail] =
    useState(false);
  const [isModalPerformanceKRACreate, setIsModalPerformanceKRACreate] =
    useState(false);
  const [isModalPerformanceKRAEdit, setIsModalPerformanceKRAEdit] =
    useState(false);
  const [modalPerformanceKRADetailData, setModalPerformanceKRADetailData] =
    useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalPerformanceKRAEditData, setModalPerformanceKRAEditData] =
    useState<any>(null);

  // Modal Detail
  const modalPerformanceKRADetailOpenPress = useCallback(
    (performanceKRA) => () => {
      setModalPerformanceKRADetailData(performanceKRA.id);
      setIsModalPerformanceKRADetail(true);
    },
    [],
  );

  const modalPerformanceKRADetailClosePress = useCallback(() => {
    setIsModalPerformanceKRADetail(false);
  }, []);

  // Modal Create
  const modalPerformanceKRACreateClosePress = useCallback(() => {
    performanceKRARefreshPress();
    setIsModalPerformanceKRACreate(false);
  }, [performanceKRARefreshPress]);

  const modalPerformanceKRACreateOpenPress = useCallback(() => {
    setIsModalPerformanceKRACreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceKRACreateOpenPress();
  }, [modalPerformanceKRACreateOpenPress]);

  // Modal Edit
  const modalPerformanceKRAEditClosePress = useCallback(() => {
    performanceKRARefreshPress();
    setIsModalPerformanceKRAEdit(false);
  }, [performanceKRARefreshPress]);

  const modalPerformanceKRAEditOpenPress = useCallback(
    (PerformanceKRA) => () => {
      setModalPerformanceKRAEditData(PerformanceKRA.id);
      setIsModalPerformanceKRAEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performancesKRADeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesKRADeletePress]);

  const deleteOnePress = useCallback(
    (performanceKRA) => () => {
      performanceKRASelectAllPress(false)();
      setModalDeleteData([performanceKRA]);
      setIsModalDelete(true);
    },
    [performanceKRASelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceKRASelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesKRA, (u: any) =>
          includes(performanceKRASelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [performanceKRASelected, performancesKRA, isPerformanceKRASelectedAll]);

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
              value={formikPerformanceFilter.values.performanceCode}
              placeholder={'Code'}
              label={'Code'}
              formik={formikPerformanceFilter}
              name={'performanceCode'}
              fluid
            />
            <Input
              value={formikPerformanceFilter.values.performanceName}
              placeholder={'Name'}
              label={'Name'}
              formik={formikPerformanceFilter}
              name={'performanceName'}
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
          {isPerformanceKRASelectedAll || performanceKRASelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERFKRA_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceKRASelectedAll
                  ? performanceKRATotalCount
                  : performanceKRASelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerformanceKRALoading || isPerformanceKRAEmpty)}
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
                  width={2}
                  collapsing
                  textAlign={'center'}
                >
                  <Icon
                    disabled={isPerformanceKRAEmpty}
                    onClick={performanceKRASelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceKRASelectedAll
                        ? 'check square outline'
                        : performanceKRASelected.length > 0
                        ? 'minus square outline'
                        : 'square outline'
                    }
                  />
                </Table.HeaderCell>
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'code'}
                  name={'Code'}
                  direction={performanceKRASort?.code}
                  onSortPress={performanceKRASortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'name'}
                  name={'Name'}
                  direction={performanceKRASort?.name}
                  onSortPress={performanceKRASortPress as any}
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
              {isPerformanceKRALoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceKRALoading && isPerformanceKRAEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceKRAError
                      ? isPerformanceKRAError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceKRALoading &&
                performancesKRA?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceKRASelectOnePress(performance.id)}
                        size={'large'}
                        name={
                          isPerformanceKRASelectedAll ||
                          includes(performanceKRASelected, performance.id)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(performance.code)}</Table.Cell>
                    <Table.Cell>{renderHyphen(performance.name)}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                      <Button
                            onClick={modalPerformanceKRADetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                          <Button
                            onClick={modalPerformanceKRAEditOpenPress(
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
          {!isPerformanceKRALoading && !isPerformanceKRAEmpty && (
            <>
              Show <b>{performancesKRA?.length}</b> of{' '}
              <b>{performanceKRATotalCount}</b> entries
              {performanceKRATotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceKRAPagePress}
                  totalPage={performanceKRATotalPage}
                  activePage={performanceKRAPage}
                  nextFivePagePress={performanceKRANextFivePagePress}
                  prevFivePagePress={performanceKRAPrevFivePagePress}
                  firstPagePress={performanceKRAFirstPagePress}
                  lastPagePress={performanceKRALastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>Remove KRA</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceKRASelectedAll
                ? `ALL DATA with total ${performanceKRATotalCount}`
                : modalDeleteData.length > 1
                ? 'these datas'
                : 'this data'}
              ?
            </span>
            {!isPerformanceKRASelectedAll && (
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
      {isModalPerformanceKRACreate && (
        <ModalPerformanceKRACreate
          isOpen={isModalPerformanceKRACreate}
          closePress={modalPerformanceKRACreateClosePress}
        />
      )}
      {isModalPerformanceKRAEdit && (
        <ModalPerformanceKRAEdit
          id={modalPerformanceKRAEditData}
          isOpen={isModalPerformanceKRAEdit}
          closePress={modalPerformanceKRAEditClosePress}
        />
      )}
      {isModalPerformanceKRADetail && (
        <ModalPerformanceKRADetail
          id={modalPerformanceKRADetailData}
          isOpen={isModalPerformanceKRADetail}
          closePress={modalPerformanceKRADetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformancesKRA;
