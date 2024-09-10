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
import usePerformancesCategory from '../../lib/data/performanceCategory/usePerformancesCategory';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceCategoryCreate from '../modal/PerformanceCategoryCreate';
import ModalPerformanceCategoryEdit from '../modal/PerformanceCategoryEdit';
import ModalPerformanceCategoryDetail from '../modal/PerformanceCategoryDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesCategoryProps {
  showFilter?: boolean;
}

const TablePerformancesCategory = ({
  showFilter = false,
}: TablePerformancesCategoryProps) => {
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
      setPerformanceCategoryFilter(newFilter);
    },
    onReset: () => {
      setPerformanceCategoryFilter({});
    },
  });

  const {
    performancesCategory,
    isPerformanceCategoryEmpty,
    isPerformanceCategoryLoading,
    performanceCategoryTotalCount,
    performanceCategoryTotalPage,
    setPerformanceCategoryFilter,
    performanceCategoryRefreshPress,
    performanceCategoryPage,
    performanceCategoryPagePress,
    performanceCategorySort,
    performanceCategorySortPress,
    isPerformanceCategoryError,
    performanceCategorySelectAllPress,
    performanceCategorySelectOnePress,
    performanceCategorySelected,
    isPerformanceCategorySelectedAll,
    performancesCategoryDeletePress,
    performanceCategoryNextFivePagePress,
    performanceCategoryPrevFivePagePress,
    performanceCategoryFirstPagePress,
    performanceCategoryLastPagePress,
  } = usePerformancesCategory();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [
    isModalPerformanceCategoryDetail,
    setIsModalPerformanceCategoryDetail,
  ] = useState(false);
  const [
    isModalPerformanceCategoryCreate,
    setIsModalPerformanceCategoryCreate,
  ] = useState(false);
  const [isModalPerformanceCategoryEdit, setIsModalPerformanceCategoryEdit] =
    useState(false);
  const [
    modalPerformanceCategoryDetailData,
    setModalPerformanceCategoryDetailData,
  ] = useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [
    modalPerformanceCategoryEditData,
    setModalPerformanceCategoryEditData,
  ] = useState<any>(null);

  // Modal Detail
  const modalPerformanceCategoryDetailOpenPress = useCallback(
    (performanceCategory) => () => {
      setModalPerformanceCategoryDetailData(performanceCategory.id);
      setIsModalPerformanceCategoryDetail(true);
    },
    [],
  );

  const modalPerformanceCategoryDetailClosePress = useCallback(() => {
    setIsModalPerformanceCategoryDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceCategoryCreateClosePress = useCallback(() => {
    performanceCategoryRefreshPress();
    setIsModalPerformanceCategoryCreate(false);
  }, [performanceCategoryRefreshPress]);

  const modalPerformanceCategoryCreateOpenPress = useCallback(() => {
    setIsModalPerformanceCategoryCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceCategoryCreateOpenPress();
  }, [modalPerformanceCategoryCreateOpenPress]);

  // Modal Edit
  const modalPerformanceCategoryEditClosePress = useCallback(() => {
    performanceCategoryRefreshPress();
    setIsModalPerformanceCategoryEdit(false);
  }, [performanceCategoryRefreshPress]);

  const modalPerformanceCategoryEditOpenPress = useCallback(
    (PerformanceCategory) => () => {
      setModalPerformanceCategoryEditData(PerformanceCategory.id);
      setIsModalPerformanceCategoryEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performancesCategoryDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesCategoryDeletePress]);

  const deleteOnePress = useCallback(
    (performanceCategory) => () => {
      performanceCategorySelectAllPress(false)();
      setModalDeleteData([performanceCategory]);
      setIsModalDelete(true);
    },
    [performanceCategorySelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceCategorySelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesCategory, (u: any) =>
          includes(performanceCategorySelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [
    performanceCategorySelected,
    performancesCategory,
    isPerformanceCategorySelectedAll,
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
          {isPerformanceCategorySelectedAll ||
          performanceCategorySelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERFCATEGORY_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceCategorySelectedAll
                  ? performanceCategoryTotalCount
                  : performanceCategorySelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isPerformanceCategoryLoading || isPerformanceCategoryEmpty)
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
                    disabled={isPerformanceCategoryEmpty}
                    onClick={performanceCategorySelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceCategorySelectedAll
                        ? 'check square outline'
                        : performanceCategorySelected.length > 0
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
                  direction={performanceCategorySort?.code}
                  onSortPress={performanceCategorySortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'name'}
                  name={'Category'}
                  direction={performanceCategorySort?.name}
                  onSortPress={performanceCategorySortPress as any}
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
              {isPerformanceCategoryLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceCategoryLoading && isPerformanceCategoryEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceCategoryError
                      ? isPerformanceCategoryError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceCategoryLoading &&
                performancesCategory?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceCategorySelectOnePress(
                          performance.id,
                        )}
                        size={'large'}
                        name={
                          isPerformanceCategorySelectedAll ||
                          includes(performanceCategorySelected, performance.id)
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
                            onClick={modalPerformanceCategoryDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                          <Button
                            onClick={modalPerformanceCategoryEditOpenPress(
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
          {!isPerformanceCategoryLoading && !isPerformanceCategoryEmpty && (
            <>
              Show <b>{performancesCategory?.length}</b> of{' '}
              <b>{performanceCategoryTotalCount}</b> entries
              {performanceCategoryTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceCategoryPagePress}
                  totalPage={performanceCategoryTotalPage}
                  activePage={performanceCategoryPage}
                  nextFivePagePress={performanceCategoryNextFivePagePress}
                  prevFivePagePress={performanceCategoryPrevFivePagePress}
                  firstPagePress={performanceCategoryFirstPagePress}
                  lastPagePress={performanceCategoryLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>Remove Category</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceCategorySelectedAll
                ? `ALL DATA with total ${performanceCategoryTotalCount}`
                : modalDeleteData.length > 1
                ? 'these datas'
                : 'this data'}
              ?
            </span>
            {!isPerformanceCategorySelectedAll && (
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
      {isModalPerformanceCategoryCreate && (
        <ModalPerformanceCategoryCreate
          isOpen={isModalPerformanceCategoryCreate}
          closePress={modalPerformanceCategoryCreateClosePress}
        />
      )}
      {isModalPerformanceCategoryEdit && (
        <ModalPerformanceCategoryEdit
          id={modalPerformanceCategoryEditData}
          isOpen={isModalPerformanceCategoryEdit}
          closePress={modalPerformanceCategoryEditClosePress}
        />
      )}
      {isModalPerformanceCategoryDetail && (
        <ModalPerformanceCategoryDetail
          id={modalPerformanceCategoryDetailData}
          isOpen={isModalPerformanceCategoryDetail}
          closePress={modalPerformanceCategoryDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformancesCategory;
