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
import usePerformancesProgram from '../../lib/data/performanceProgram/usePerformancePrograms';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { filter, includes } from 'lodash';
import Avatar from 'react-avatar';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import ModalPerformanceProgramCreate from '../modal/PerformanceProgramCreate';
import ModalPerformanceProgramEdit from '../modal/PerformanceProgramEdit';
import renderDate from '../../lib/util/renderDate';
import ModalPerformanceProgramDetail from '../modal/PerformanceProgramDetail';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformancesProgramProps {
  showFilter?: boolean;
}

const TablePerformanceProgram = ({
  showFilter = true,
}: TablePerformancesProgramProps) => {
  const formikPerformanceFilter = useFormik({
    initialValues: {
      code: '',
      name: '',
      formMember: '',
      formTerm: '',
      startDate: '',
      endDate: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        code: values.code,
        name: values.name,
        formTerm: values.formTerm,
        formMember: values.formMember,
        startDate: values.startDate,
        endDate: values.endDate,
      };

      setPerformanceProgramFilter(newFilter);
    },
    onReset: () => {
      setPerformanceProgramFilter({});
    },
  });

  const {
    performancesProgram,
    isPerformanceProgramEmpty,
    isPerformanceProgramLoading,
    performanceProgramTotalCount,
    performanceProgramTotalPage,
    setPerformanceProgramFilter,
    performanceProgramRefreshPress,
    performanceProgramPage,
    performanceProgramPagePress,
    performanceProgramSort,
    performanceProgramSortPress,
    isPerformanceProgramError,
    performanceProgramSelectAllPress,
    performanceProgramSelected,
    isPerformanceProgramSelectedAll,
    performancesProgramDeletePress,
    performancesProgramNextFivePagePress,
    performancesProgramPrevFivePagePress,
    performancesProgramFirstPagePress,
    performancesProgramLastPagePress,
  } = usePerformancesProgram();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalPerformanceProgramDetail, setIsModalPerformanceProgramDetail] =
    useState(false);
  const [isModalPerformanceProgramCreate, setIsModalPerformanceProgramCreate] =
    useState(false);
  const [isModalPerformanceProgramEdit, setIsModalPerformanceProgramEdit] =
    useState(false);
  const [
    modalPerformanceProgramDetailData,
    setModalPerformanceProgramDetailData,
  ] = useState<any>(null);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalPerformanceProgramEditData, setModalPerformanceProgramEditData] =
    useState<any>(null);

  // Modal Detail
  const modalPerformanceProgramDetailOpenPress = useCallback(
    (performanceProgram) => () => {
      setModalPerformanceProgramDetailData(performanceProgram.id);
      setIsModalPerformanceProgramDetail(true);
    },
    [],
  );

  const modalPerformanceProgramDetailClosePress = useCallback(() => {
    setIsModalPerformanceProgramDetail(false);
  }, []);

  // Modal Create
  const modalPerformanceProgramCreateClosePress = useCallback(() => {
    performanceProgramRefreshPress();
    setIsModalPerformanceProgramCreate(false);
  }, [performanceProgramRefreshPress]);

  const modalPerformanceProgramCreateOpenPress = useCallback(() => {
    setIsModalPerformanceProgramCreate(true);
  }, []);

  const performanceCreatePress = useCallback(() => {
    modalPerformanceProgramCreateOpenPress();
  }, [modalPerformanceProgramCreateOpenPress]);

  // Modal Edit
  const modalPerformanceProgramEditClosePress = useCallback(() => {
    performanceProgramRefreshPress();
    setIsModalPerformanceProgramEdit(false);
  }, [performanceProgramRefreshPress]);

  const modalPerformanceProgramEditOpenPress = useCallback(
    (PerformanceProgram) => () => {
      setModalPerformanceProgramEditData(PerformanceProgram.id);
      setIsModalPerformanceProgramEdit(true);
    },
    [],
  );

  // Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    performancesProgramDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, performancesProgramDeletePress]);

  const deleteOnePress = useCallback(
    (performanceProgram) => () => {
      performanceProgramSelectAllPress(false)();
      setModalDeleteData([performanceProgram]);
      setIsModalDelete(true);
    },
    [performanceProgramSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isPerformanceProgramSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(performancesProgram, (u: any) =>
          includes(performanceProgramSelected, u.id),
        ),
      );
    setIsModalDelete(true);
  }, [
    performanceProgramSelected,
    performancesProgram,
    isPerformanceProgramSelectedAll,
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
       <Form.Group widths={'equal'} style={{ marginBottom: '10px' }}>
         <Input
           value={formikPerformanceFilter.values.code}
           placeholder={'Insert Code'}
           label={'Code'}
           formik={formikPerformanceFilter}
           name={'code'}
         />
         <Input
           value={formikPerformanceFilter.values.name}
           placeholder={'Insert Name'}
           label={'Name'}
           formik={formikPerformanceFilter}
           name={'name'}
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
             onClick={performanceProgramRefreshPress as any}
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
               labelPosition={'left'}
               onClick={performanceCreatePress}
             >
               Create New
               <Icon name={'plus'} />
             </Button>
         </Form.Field>
       </Form.Group>
     </Form>
      )}
          {isPerformanceProgramSelectedAll ||
          performanceProgramSelected.length ? (
            <RenderGuard actionKey={RightEnum.MD_PERF_DELETE}>
              <Button
                onClick={deleteAllPress}
                size={'tiny'}
                negative
                icon
                labelPosition={'left'}
              >
                Delete (
                {isPerformanceProgramSelectedAll
                  ? performanceProgramTotalCount
                  : performanceProgramSelected.length}
                )
                <Icon name={'trash'} />
              </Button>
            </RenderGuard>
          ) : null}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isPerformanceProgramLoading || isPerformanceProgramEmpty)
            }
            className={'nomargin'}
            color={'black'}
            singleLine
            compact
            fixed
            style={{ width: '100%' }}
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell
                  sortable
                  width={8}
                  attribute={'code'}
                  name={'Code Program'}
                  direction={performanceProgramSort?.code}
                  onSortPress={performanceProgramSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={8}
                  attribute={'name'}
                  name={'Name Program'}
                  direction={performanceProgramSort?.name}
                  onSortPress={performanceProgramSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={4}
                  attribute={'startDate'}
                  name={'Start'}
                  direction={performanceProgramSort?.startDate}
                  onSortPress={performanceProgramSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={4}
                  attribute={'endDate'}
                  name={'End'}
                  direction={performanceProgramSort?.endDate}
                  onSortPress={performanceProgramSortPress}
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
              {isPerformanceProgramLoading && (
                <TablePlaceholder rowCount={15} colCount={7} />
              )}
              {!isPerformanceProgramLoading && isPerformanceProgramEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceProgramError
                      ? isPerformanceProgramError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerformanceProgramLoading &&
                performancesProgram?.map((performance: any) => (
                  <Table.Row key={performance.id}>
                    <Table.Cell>{renderHyphen(performance.code)}</Table.Cell>
                    <Table.Cell>{renderHyphen(performance.name)}</Table.Cell>
                    <Table.Cell>
                      {renderHyphen(renderDate(performance.startDate))}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(renderDate(performance.endDate))}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <RenderGuard actionKey={RightEnum.PERF_PROGRAM_VIEW}>
                          <Button
                            onClick={modalPerformanceProgramDetailOpenPress(
                              performance,
                            )}
                            icon={'eye'}
                          />
                        </RenderGuard>
                        <RenderGuard actionKey={RightEnum.PERF_PROGRAM_EDIT}>
                          <Button
                            onClick={modalPerformanceProgramEditOpenPress(
                              performance,
                            )}
                            icon={'pencil'}
                          />
                        </RenderGuard>
                        <RenderGuard actionKey={RightEnum.PERF_PROGRAM_DELETE}>
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
          {!isPerformanceProgramLoading && !isPerformanceProgramEmpty && (
            <>
              Show <b>{performancesProgram?.length}</b> of{' '}
              <b>{performanceProgramTotalCount}</b> entries
              {performanceProgramTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={performanceProgramPagePress}
                  totalPage={performanceProgramTotalPage}
                  activePage={performanceProgramPage}
                  nextFivePagePress={performancesProgramNextFivePagePress}
                  prevFivePagePress={performancesProgramPrevFivePagePress}
                  firstPagePress={performancesProgramFirstPagePress}
                  lastPagePress={performancesProgramLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'black'} />
            <span style={{ marginLeft: '.7em' }}>
              Remove Program Performance
            </span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to remove {' '}
              {isPerformanceProgramSelectedAll
                ? `ALL PROGRAM PERFORMANCE with total ${performanceProgramTotalCount}`
                : modalDeleteData.length > 1
                ? 'these program performance '
                : 'this program performance '}
              ?
            </span>
            {!isPerformanceProgramSelectedAll && (
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
      {isModalPerformanceProgramCreate && (
        <ModalPerformanceProgramCreate
          isOpen={isModalPerformanceProgramCreate}
          closePress={modalPerformanceProgramCreateClosePress}
        />
      )}
      {isModalPerformanceProgramEdit && (
        <ModalPerformanceProgramEdit
          id={modalPerformanceProgramEditData}
          isOpen={isModalPerformanceProgramEdit}
          closePress={modalPerformanceProgramEditClosePress}
        />
      )}
      {isModalPerformanceProgramDetail && (
        <ModalPerformanceProgramDetail
          id={modalPerformanceProgramDetailData}
          isOpen={isModalPerformanceProgramDetail}
          closePress={modalPerformanceProgramDetailClosePress}
        />
      )}
    </>
  );
};

export default TablePerformanceProgram;
