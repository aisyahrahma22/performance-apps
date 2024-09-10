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
import usePerformancesTarget from '../../lib/data/performanceTarget/usePerformancesTarget';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceTargetCreate from '../modal/PerformanceTargetCreate';
import ModalPerformanceTargetEdit from '../modal/PerformanceTargetEdit';
import ModalPerformanceTargetDetail from '../modal/PerformanceTargetDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesTargetProps {
  showFilter?: boolean;
}

const TablePerformancesTarget = ({
  showFilter = false,
}: TablePerformancesTargetProps) => {
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
      setPerformanceTargetFilter(newFilter);
    },
    onReset: () => {
      setPerformanceTargetFilter({});
    },
  });

  const {
    performancesTarget,
    isPerformanceTargetEmpty,
    isPerformanceTargetLoading,
    performanceTargetTotalCount,
    performanceTargetTotalPage,
    setPerformanceTargetFilter,
    performanceTargetRefreshPress,
    performanceTargetPage,
    performanceTargetPagePress,
    performanceTargetSort,
    performanceTargetSortPress,
    isPerformanceTargetError,
    performanceTargetSelectAllPress,
    performanceTargetSelectOnePress,
    performanceTargetSelected,
    isPerformanceTargetSelectedAll,
    performancesTargetDeletePress,
    performanceTargetNextFivePagePress,
    performanceTargetPrevFivePagePress,
    performanceTargetFirstPagePress,
    performanceTargetLastPagePress,
  } = usePerformancesTarget();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalPerformanceTargetDetail, setIsModalPerformanceTargetDetail] =
    useState(false);
  const [isModalPerformanceTargetCreate, setIsModalPerformanceTargetCreate] =
    useState(false);
  const [isModalPerformanceTargetEdit, setIsModalPerformanceTargetEdit] =
    useState(false);
  const [
    modalPerformanceTargetDetailData,
    setModalPerformanceTargetDetailData,
  ] = useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalPerformanceTargetEditData, setModalPerformanceTargetEditData] =
    useState<any>(null);

  // Modal Detail
  const modalPerformanceTargetDetailOpenPress = useCallback(
    (performanceTarget) => () => {
      setModalPerformanceTargetDetailData(performanceTarget.id);
      setIsModalPerformanceTargetDetail(true);
    },
    [],
  );

  const modalPerformanceTargetDetailClosePress = useCallback(() => {
    setIsModalPerformanceTargetDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceTargetCreateClosePress = useCallback(() => {
    performanceTargetRefreshPress();
    setIsModalPerformanceTargetCreate(false);
  }, [performanceTargetRefreshPress]);

  const modalPerformanceTargetCreateOpenPress = useCallback(() => {
    setIsModalPerformanceTargetCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceTargetCreateOpenPress();
  }, [modalPerformanceTargetCreateOpenPress]);

  // Modal Edit
  const modalPerformanceTargetEditClosePress = useCallback(() => {
    performanceTargetRefreshPress();
    setIsModalPerformanceTargetEdit(false);
  }, [performanceTargetRefreshPress]);

  const modalPerformanceTargetEditOpenPress = useCallback(
    (PerformanceTarget) => () => {
      setModalPerformanceTargetEditData(PerformanceTarget.id);
      setIsModalPerformanceTargetEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performancesTargetDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesTargetDeletePress]);

  const deleteOnePress = useCallback(
    (performanceTarget) => () => {
      performanceTargetSelectAllPress(false)();
      setModalDeleteData([performanceTarget]);
      setIsModalDelete(true);
    },
    [performanceTargetSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceTargetSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesTarget, (u: any) =>
          includes(performanceTargetSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [
    performanceTargetSelected,
    performancesTarget,
    isPerformanceTargetSelectedAll,
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
          {isPerformanceTargetSelectedAll ||
          performanceTargetSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERFTARGET_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceTargetSelectedAll
                  ? performanceTargetTotalCount
                  : performanceTargetSelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isPerformanceTargetLoading || isPerformanceTargetEmpty)
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
                  width={2}
                  collapsing
                  textAlign={'center'}
                >
                  <Icon
                    disabled={isPerformanceTargetEmpty}
                    onClick={performanceTargetSelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceTargetSelectedAll
                        ? 'check square outline'
                        : performanceTargetSelected.length > 0
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
                  direction={performanceTargetSort?.code}
                  onSortPress={performanceTargetSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'name'}
                  name={'Name'}
                  direction={performanceTargetSort?.name}
                  onSortPress={performanceTargetSortPress as any}
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
              {isPerformanceTargetLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceTargetLoading && isPerformanceTargetEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceTargetError
                      ? isPerformanceTargetError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceTargetLoading &&
                performancesTarget?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceTargetSelectOnePress(
                          performance.id,
                        )}
                        size={'large'}
                        name={
                          isPerformanceTargetSelectedAll ||
                          includes(performanceTargetSelected, performance.id)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(performance.code)}</Table.Cell>
                    <Popup
                      content={
                        <List>
                          <Label>{renderHyphen(performance.name)}</Label>
                        </List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(performance.name)}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                      <Button
                            onClick={modalPerformanceTargetDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                            <Button
                            onClick={modalPerformanceTargetEditOpenPress(
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
          {!isPerformanceTargetLoading && !isPerformanceTargetEmpty && (
            <>
              Show <b>{performancesTarget?.length}</b> of{' '}
              <b>{performanceTargetTotalCount}</b> entries
              {performanceTargetTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceTargetPagePress}
                  totalPage={performanceTargetTotalPage}
                  activePage={performanceTargetPage}
                  nextFivePagePress={performanceTargetNextFivePagePress}
                  prevFivePagePress={performanceTargetPrevFivePagePress}
                  firstPagePress={performanceTargetFirstPagePress}
                  lastPagePress={performanceTargetLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>Remove Target</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceTargetSelectedAll
                ? `ALL DATA with total ${performanceTargetTotalCount}`
                : modalDeleteData.length > 1
                ? 'these data'
                : 'this data'}
              ?
            </span>
            {!isPerformanceTargetSelectedAll && (
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
      {isModalPerformanceTargetCreate && (
        <ModalPerformanceTargetCreate
          isOpen={isModalPerformanceTargetCreate}
          closePress={modalPerformanceTargetCreateClosePress}
        />
      )}
      {isModalPerformanceTargetEdit && (
        <ModalPerformanceTargetEdit
          id={modalPerformanceTargetEditData}
          isOpen={isModalPerformanceTargetEdit}
          closePress={modalPerformanceTargetEditClosePress}
        />
      )}
      {isModalPerformanceTargetDetail && (
        <ModalPerformanceTargetDetail
          id={modalPerformanceTargetDetailData}
          isOpen={isModalPerformanceTargetDetail}
          closePress={modalPerformanceTargetDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformancesTarget;
