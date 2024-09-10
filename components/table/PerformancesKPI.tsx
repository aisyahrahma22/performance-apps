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
import usePerformancesKPI from '../../lib/data/performanceKPI/usePerformancesKPI';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import ModalPerformanceKPICreate from '../modal/PerformanceKPICreate';
import ModalPerformanceKPIEdit from '../modal/PerformanceKPIEdit';
import ModalPerformanceKPIDetail from '../modal/PerformanceKPIDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesKPIProps {
  showFilter?: boolean;
}

const TablePerformancesKPI = ({
  showFilter = false,
}: TablePerformancesKPIProps) => {
  const formikPerformanceFilter = useFormik({
    initialValues: {
      performanceCode: '',
      performanceName: '',
      decription: '',
      keyAction: '',
      behaviour: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        code: values.performanceCode,
        name: values.performanceName,
        decription: values.decription,
        keyAction: values.keyAction,
        behaviour: values.behaviour,
      };
      setPerformanceKPIFilter(newFilter);
    },
    onReset: () => {
      setPerformanceKPIFilter({});
    },
  });

  const {
    performancesKPI,
    isPerformanceKPIEmpty,
    isPerformanceKPILoading,
    performanceKPITotalCount,
    performanceKPITotalPage,
    setPerformanceKPIFilter,
    performanceKPIRefreshPress,
    performanceKPIPage,
    performanceKPIPagePress,
    performanceKPISort,
    performanceKPISortPress,
    isPerformanceKPIError,
    performanceKPISelectAllPress,
    performanceKPISelectOnePress,
    performanceKPISelected,
    isPerformanceKPISelectedAll,
    performancesKPIDeletePress,
    performanceKPINextFivePagePress,
    performanceKPIPrevFivePagePress,
    performanceKPIFirstPagePress,
    performanceKPILastPagePress,
  } = usePerformancesKPI();

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalPerformanceKPIDetail, setIsModalPerformanceKPIDetail] =
    useState(false);
  const [isModalPerformanceKPICreate, setIsModalPerformanceKPICreate] =
    useState(false);
  const [isModalPerformanceKPIEdit, setIsModalPerformanceKPIEdit] =
    useState(false);
  const [modalPerformanceKPIDetailData, setModalPerformanceKPIDetailData] =
    useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalPerformanceKPIEditData, setModalPerformanceKPIEditData] =
    useState<any>(null);

  // Modal Detail
  const modalPerformanceKPIDetailOpenPress = useCallback(
    (performanceKPI) => () => {
      setModalPerformanceKPIDetailData(performanceKPI.id);
      setIsModalPerformanceKPIDetail(true);
    },
    [],
  );

  const modalPerformanceKPIDetailClosePress = useCallback(() => {
    setIsModalPerformanceKPIDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceKPICreateClosePress = useCallback(() => {
    performanceKPIRefreshPress();
    setIsModalPerformanceKPICreate(false);
  }, [performanceKPIRefreshPress]);

  const modalPerformanceKPICreateOpenPress = useCallback(() => {
    setIsModalPerformanceKPICreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceKPICreateOpenPress();
  }, [modalPerformanceKPICreateOpenPress]);

  // Modal Edit
  const modalPerformanceKPIEditClosePress = useCallback(() => {
    performanceKPIRefreshPress();
    setIsModalPerformanceKPIEdit(false);
  }, [performanceKPIRefreshPress]);

  const modalPerformanceKPIEditOpenPress = useCallback(
    (PerformanceKPI) => () => {
      setModalPerformanceKPIEditData(PerformanceKPI.id);
      setIsModalPerformanceKPIEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performancesKPIDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesKPIDeletePress]);

  const deleteOnePress = useCallback(
    (performanceKPI) => () => {
      performanceKPISelectAllPress(false)();
      setModalDeleteData([performanceKPI]);
      setIsModalDelete(true);
    },
    [performanceKPISelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceKPISelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesKPI, (u: any) =>
          includes(performanceKPISelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [performanceKPISelected, performancesKPI, isPerformanceKPISelectedAll]);

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
          {isPerformanceKPISelectedAll || performanceKPISelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERFKPI_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceKPISelectedAll
                  ? performanceKPITotalCount
                  : performanceKPISelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isPerformanceKPILoading || isPerformanceKPIEmpty)}
            className={'nomargin'}
            color={'black'}
            singleLine
            compact
            fixed
            style={{ width: '100%' }}
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
                    disabled={isPerformanceKPIEmpty}
                    onClick={performanceKPISelectAllPress()}
                    size={'large'}
                    name={
                      isPerformanceKPISelectedAll
                        ? 'check square outline'
                        : performanceKPISelected.length > 0
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
                  direction={performanceKPISort?.code}
                  onSortPress={performanceKPISortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'name'}
                  name={'Name'}
                  direction={performanceKPISort?.name}
                  onSortPress={performanceKPISortPress as any}
                />
                <TableHeaderCell
                  sortable
                  width={6}
                  attribute={'description'}
                  name={'Description'}
                  direction={performanceKPISort?.description}
                  onSortPress={performanceKPISortPress as any}
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
              {isPerformanceKPILoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceKPILoading && isPerformanceKPIEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceKPIError
                      ? isPerformanceKPIError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceKPILoading &&
                performancesKPI?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={performanceKPISelectOnePress(performance.id)}
                        size={'large'}
                        name={
                          isPerformanceKPISelectedAll ||
                          includes(performanceKPISelected, performance.id)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Popup
                      content={<List>{renderHyphen(performance?.code)}</List>}
                      trigger={
                        <Table.Cell>
                          {renderHyphen(performance?.code)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={<List>{renderHyphen(performance?.name)}</List>}
                      trigger={
                        <Table.Cell>
                          {renderHyphen(performance?.name)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderHyphen(performance?.description)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(performance?.description)}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                      <Button
                            onClick={modalPerformanceKPIDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                           <Button
                            onClick={modalPerformanceKPIEditOpenPress(
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
          {!isPerformanceKPILoading && !isPerformanceKPIEmpty && (
            <>
              Show <b>{performancesKPI?.length}</b> of{' '}
              <b>{performanceKPITotalCount}</b> entries
              {performanceKPITotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceKPIPagePress}
                  totalPage={performanceKPITotalPage}
                  activePage={performanceKPIPage}
                  nextFivePagePress={performanceKPINextFivePagePress}
                  prevFivePagePress={performanceKPIPrevFivePagePress}
                  firstPagePress={performanceKPIFirstPagePress}
                  lastPagePress={performanceKPILastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal
          onClose={modalDeleteClosePress}
          open={isModalDelete}
          size="tiny"
          closeOnDimmerClick={false}
        >
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>
              Remove KPI
            </span>
          </Modal.Header>
          <Modal.Content scrolling>
            <span>
              Are you sure want to remove{' '}
              {isPerformanceKPISelectedAll
                ? `ALL DATA with total ${performanceKPITotalCount}`
                : modalDeleteData.length > 1
                ? 'these data'
                : 'this data'}
              ?
            </span>
            {!isPerformanceKPISelectedAll && (
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
                        width={'14'}
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
      {isModalPerformanceKPICreate && (
        <ModalPerformanceKPICreate
          isOpen={isModalPerformanceKPICreate}
          closePress={modalPerformanceKPICreateClosePress}
        />
      )}
      {isModalPerformanceKPIEdit && (
        <ModalPerformanceKPIEdit
          id={modalPerformanceKPIEditData}
          isOpen={isModalPerformanceKPIEdit}
          closePress={modalPerformanceKPIEditClosePress}
        />
      )}
      {isModalPerformanceKPIDetail && (
        <ModalPerformanceKPIDetail
          id={modalPerformanceKPIDetailData}
          isOpen={isModalPerformanceKPIDetail}
          closePress={modalPerformanceKPIDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformancesKPI;
