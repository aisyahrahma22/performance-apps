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
import ModalPerformanceFormTypeCreate from '../modal/PerformanceFormTypeCreate';
import ModalPerformanceFormTypeEdit from '../modal/PerformanceFormTypeEdit';
import ModalPerformanceFormTypeDetail from '../modal/PerformanceFormTypeDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import usePerformanceFormType from '../../lib/data/performanceFormType/usePerformanceFormType';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformanceFormTypeProps {
  showFilter?: boolean;
}

const TablePerformanceFormType = ({
  showFilter = false,
}: TablePerformanceFormTypeProps) => {
  const formikPerformanceFormTypeFilter = useFormik({
    initialValues: {
      performanceFormTypeCode: '',
      performanceFormTypeName: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        code: values.performanceFormTypeCode,
        name: values.performanceFormTypeName,
      };
      setPerformanceFormTypeFilter(newFilter);
    },
    onReset: () => {
      setPerformanceFormTypeFilter({});
    },
  });

  const {
    performanceFormType,
    isPerformanceFormTypeEmpty,
    isPerformanceFormTypeLoading,
    performanceFormTypeTotalCount,
    performanceFormTypeTotalPage,
    setPerformanceFormTypeFilter,
    performanceFormTypeRefreshPress,
    performanceFormTypePage,
    performanceFormTypePagePress,
    performanceFormTypeSort,
    performanceFormTypeSortPress,
    isPerformanceFormTypeError,
    performanceFormTypeSelectAllPress,
    performanceFormTypeSelectOnePress,
    performanceFormTypeSelected,
    isPerformanceFormTypeSelectedAll,
    performanceFormTypeDeletePress,
    performanceFormTypeNextFivePagePress,
    performanceFormTypePrevFivePagePress,
    performanceFormTypeFirstPagePress,
    performanceFormTypeLastPagePress,
  } = usePerformanceFormType();

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
    performanceFormTypeRefreshPress();
    setIsModalPerformanceCreate(false);
  }, [performanceFormTypeRefreshPress]);

  const modalPerformanceCreateOpenPress = useCallback(() => {
    setIsModalPerformanceCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceCreateOpenPress();
  }, [modalPerformanceCreateOpenPress]);

  // Modal Edit
  const modalPerformanceEditClosePress = useCallback(() => {
    performanceFormTypeRefreshPress();
    setIsModalPerformanceEdit(false);
  }, [performanceFormTypeRefreshPress]);

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
    performanceFormTypeDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performanceFormTypeDeletePress]);

  const deleteOnePress = useCallback(
    (performance) => () => {
      performanceFormTypeSelectAllPress(false)();
      setModalDeleteData([performance]);
      setIsModalDelete(true);
    },
    [performanceFormTypeSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceFormTypeSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performanceFormType, (u: any) =>
          includes(performanceFormTypeSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [
    performanceFormTypeSelected,
    performanceFormType,
    isPerformanceFormTypeSelectedAll,
  ]);

  const formikPerformanceFormTypeFilterResetPress = useCallback(
    () => formikPerformanceFormTypeFilter.resetForm(),
    [formikPerformanceFormTypeFilter],
  );

  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
          <Form onSubmit={formikPerformanceFormTypeFilter.handleSubmit}>
          <Form.Group widths={'equal'}>
            <Input
              value={
                formikPerformanceFormTypeFilter.values.performanceFormTypeCode
              }
              placeholder={'Code'}
              label={'Code'}
              formik={formikPerformanceFormTypeFilter}
              name={'performanceFormTypeCode'}
            />
            <Input
              value={
                formikPerformanceFormTypeFilter.values.performanceFormTypeName
              }
              placeholder={'Name'}
              label={'Name'}
              formik={formikPerformanceFormTypeFilter}
              name={'performanceFormTypeName'}
            />
            <Form.Field>
              <label>&nbsp;</label>
              <Popup
                trigger={
                  <Button
                    disabled={!formikPerformanceFormTypeFilter.dirty}
                    type={'reset'}
                    onClick={formikPerformanceFormTypeFilterResetPress}
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
          {isPerformanceFormTypeSelectedAll ||
          performanceFormTypeSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERF_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceFormTypeSelectedAll
                  ? performanceFormTypeTotalCount
                  : performanceFormTypeSelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isPerformanceFormTypeLoading || isPerformanceFormTypeEmpty)
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
                    disabled={isPerformanceFormTypeEmpty}
                    onClick={performanceFormTypeSelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceFormTypeSelectedAll
                        ? 'check square outline'
                        : performanceFormTypeSelected.length > 0
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
                  direction={performanceFormTypeSort?.code}
                  onSortPress={performanceFormTypeSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'name'}
                  name={'Name'}
                  direction={performanceFormTypeSort?.name}
                  onSortPress={performanceFormTypeSortPress as any}
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
              {isPerformanceFormTypeLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceFormTypeLoading && isPerformanceFormTypeEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceFormTypeError
                      ? isPerformanceFormTypeError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceFormTypeLoading &&
                performanceFormType?.map((performanceFormType: any) => (
                  <Table.Row key={performanceFormType.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceFormTypeSelectOnePress(
                          performanceFormType.id,
                        )}
                        size={'large'}
                        name={
                          isPerformanceFormTypeSelectedAll ||
                          includes(
                            performanceFormTypeSelected,
                            performanceFormType.id,
                          )
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performanceFormType.code)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(performanceFormType.name)}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                      <Button
                        onClick={modalPerformanceDetailOpenPress(
                          performanceFormType,
                        )}
                        icon={'eye'}
                      />
                        <Button
                        onClick={modalPerformanceEditOpenPress(
                          performanceFormType,
                        )}
                        icon={'pencil'}
                      />
                      <Button
                        onClick={deleteOnePress(performanceFormType)}
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
          {!isPerformanceFormTypeLoading && !isPerformanceFormTypeEmpty && (
            <>
              Show <b>{performanceFormType?.length}</b> of{' '}
              <b>{performanceFormTypeTotalCount}</b> entries
              {performanceFormTypeTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceFormTypePagePress}
                  totalPage={performanceFormTypeTotalPage}
                  activePage={performanceFormTypePage}
                  nextFivePagePress={performanceFormTypeNextFivePagePress}
                  prevFivePagePress={performanceFormTypePrevFivePagePress}
                  firstPagePress={performanceFormTypeFirstPagePress}
                  lastPagePress={performanceFormTypeLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>
              Remove Performance Form Type
            </span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceFormTypeSelectedAll
                ? `ALL DATA with total ${performanceFormTypeTotalCount}`
                : modalDeleteData.length > 1
                ? 'these datas'
                : 'this data'}
              ?
            </span>
            {!isPerformanceFormTypeSelectedAll && (
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
      {isModalPerformanceCreate && (
        <ModalPerformanceFormTypeCreate
          isOpen={isModalPerformanceCreate}
          closePress={modalPerformanceCreateClosePress}
        />
      )}
      {isModalPerformanceEdit && (
        <ModalPerformanceFormTypeEdit
          id={modalPerformanceEditData}
          isOpen={isModalPerformanceEdit}
          closePress={modalPerformanceEditClosePress}
        />
      )}
      {isModalPerformanceDetail && (
        <ModalPerformanceFormTypeDetail
          id={modalPerformanceDetailData}
          isOpen={isModalPerformanceDetail}
          closePress={modalPerformanceDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformanceFormType;
