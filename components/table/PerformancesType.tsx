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
import usePerformancesType from '../../lib/data/performanceType/usePerformancesType';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceTypeCreate from '../modal/PerformanceTypeCreate';
import ModalPerformanceTypeEdit from '../modal/PerformanceTypeEdit';
import ModalPerformanceTypeDetail from '../modal/PerformanceTypeDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesTypeProps {
  showFilter?: boolean;
}

const TablePerformancesType = ({
  showFilter = false,
}: TablePerformancesTypeProps) => {
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
      setPerformanceTypeFilter(newFilter);
    },
    onReset: () => {
      setPerformanceTypeFilter({});
    },
  });

  const {
    performancesType,
    isPerformanceTypeEmpty,
    isPerformanceTypeLoading,
    performanceTypeTotalCount,
    performanceTypeTotalPage,
    setPerformanceTypeFilter,
    performanceTypeRefreshPress,
    performanceTypePage,
    performanceTypePagePress,
    performanceTypeSort,
    performanceTypeSortPress,
    isPerformanceTypeError,
    performanceTypeSelectAllPress,
    performanceTypeSelectOnePress,
    performanceTypeSelected,
    isPerformanceTypeSelectedAll,
    performancesTypeDeletePress,
    performancesTypeNextFivePagePress,
    performancesTypePrevFivePagePress,
    performancesTypeFirstPagePress,
    performancesTypeLastPagePress,
  } = usePerformancesType();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalPerformanceTypeDetail, setIsModalPerformanceTypeDetail] =
    useState(false);
  const [isModalPerformanceTypeCreate, setIsModalPerformanceTypeCreate] =
    useState(false);
  const [isModalPerformanceTypeEdit, setIsModalPerformanceTypeEdit] =
    useState(false);
  const [modalPerformanceTypeDetailData, setModalPerformanceTypeDetailData] =
    useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalPerformanceTypeEditData, setModalPerformanceTypeEditData] =
    useState<any>(null);

  // Modal Detail
  const modalPerformanceTypeDetailOpenPress = useCallback(
    (performanceType) => () => {
      setModalPerformanceTypeDetailData(performanceType.id);
      setIsModalPerformanceTypeDetail(true);
    },
    [],
  );

  const modalPerformanceTypeDetailClosePress = useCallback(() => {
    setIsModalPerformanceTypeDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceTypeCreateClosePress = useCallback(() => {
    performanceTypeRefreshPress();
    setIsModalPerformanceTypeCreate(false);
  }, [performanceTypeRefreshPress]);

  const modalPerformanceTypeCreateOpenPress = useCallback(() => {
    setIsModalPerformanceTypeCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceTypeCreateOpenPress();
  }, [modalPerformanceTypeCreateOpenPress]);

  // Modal Edit
  const modalPerformanceTypeEditClosePress = useCallback(() => {
    performanceTypeRefreshPress();
    setIsModalPerformanceTypeEdit(false);
  }, [performanceTypeRefreshPress]);

  const modalPerformanceTypeEditOpenPress = useCallback(
    (PerformanceType) => () => {
      setModalPerformanceTypeEditData(PerformanceType.id);
      setIsModalPerformanceTypeEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performancesTypeDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesTypeDeletePress]);

  const deleteOnePress = useCallback(
    (performanceType) => () => {
      performanceTypeSelectAllPress(false)();
      setModalDeleteData([performanceType]);
      setIsModalDelete(true);
    },
    [performanceTypeSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceTypeSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesType, (u: any) =>
          includes(performanceTypeSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [performanceTypeSelected, performancesType, isPerformanceTypeSelectedAll]);

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
          {isPerformanceTypeSelectedAll || performanceTypeSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERFTYP_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceTypeSelectedAll
                  ? performanceTypeTotalCount
                  : performanceTypeSelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerformanceTypeLoading || isPerformanceTypeEmpty)}
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
                    disabled={isPerformanceTypeEmpty}
                    onClick={performanceTypeSelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceTypeSelectedAll
                        ? 'check square outline'
                        : performanceTypeSelected.length > 0
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
                  direction={performanceTypeSort?.code}
                  onSortPress={performanceTypeSortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'name'}
                  name={'Name'}
                  direction={performanceTypeSort?.name}
                  onSortPress={performanceTypeSortPress as any}
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
              {isPerformanceTypeLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceTypeLoading && isPerformanceTypeEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceTypeError
                      ? isPerformanceTypeError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceTypeLoading &&
                performancesType?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceTypeSelectOnePress(performance.id)}
                        size={'large'}
                        name={
                          isPerformanceTypeSelectedAll ||
                          includes(performanceTypeSelected, performance.id)
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
                            onClick={modalPerformanceTypeDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                            <Button
                            onClick={modalPerformanceTypeEditOpenPress(
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
          {!isPerformanceTypeLoading && !isPerformanceTypeEmpty && (
            <>
              Show <b>{performancesType?.length}</b> of{' '}
              <b>{performanceTypeTotalCount}</b> entries
              {performanceTypeTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceTypePagePress}
                  totalPage={performanceTypeTotalPage}
                  activePage={performanceTypePage}
                  nextFivePagePress={performancesTypeNextFivePagePress}
                  prevFivePagePress={performancesTypePrevFivePagePress}
                  firstPagePress={performancesTypeFirstPagePress}
                  lastPagePress={performancesTypeLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>Remove Performance Type</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceTypeSelectedAll
                ? `ALL DATA with total ${performanceTypeTotalCount}`
                : modalDeleteData.length > 1
                ? 'these datas'
                : 'this data'}
              ?
            </span>
            {!isPerformanceTypeSelectedAll && (
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
      {isModalPerformanceTypeCreate && (
        <ModalPerformanceTypeCreate
          isOpen={isModalPerformanceTypeCreate}
          closePress={modalPerformanceTypeCreateClosePress}
        />
      )}
      {isModalPerformanceTypeEdit && (
        <ModalPerformanceTypeEdit
          id={modalPerformanceTypeEditData}
          isOpen={isModalPerformanceTypeEdit}
          closePress={modalPerformanceTypeEditClosePress}
        />
      )}
      {isModalPerformanceTypeDetail && (
        <ModalPerformanceTypeDetail
          id={modalPerformanceTypeDetailData}
          isOpen={isModalPerformanceTypeDetail}
          closePress={modalPerformanceTypeDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformancesType;
