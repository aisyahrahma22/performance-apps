import { Button, Form, Icon, Popup, Segment, Table } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { groupBy, size } from 'lodash';
import { useFormik } from 'formik';
import Input from '../Input';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import usePerformanceWorkflowPositions from '../../lib/data/performanceWorkflowPosition/usePerformanceWorkflowPositions';
import ModalPerformanceWorkflowPositionDetail from '../modal/PerformanceWorkflowPositionDetail';
import ModalPerformanceWorkflowPositionEdit from '../modal/PerformanceWorkflowPositionEdit';
import TablePaginationNew from '../TablePaginationNew';

interface TablePerformanceWorkflowPositionProps {
  showFilter?: boolean;
}
const TablePerformanceWorkflowPosition = ({
  showFilter = false,
}: TablePerformanceWorkflowPositionProps) => {
  const formikPerformanceWorkflowPositionFilter = useFormik({
    initialValues: {
      name: '',
      code: '',
      isActive: true,
    },
    onSubmit: (values) => {
      setPerformanceWorkflowPositionFilter({
        ...values,
      });
    },
    onReset: () => {
      setPerformanceWorkflowPositionFilter({});
    },
  });
  const {
    performanceWorkflowPosition,
    isPerformanceWorkflowPositionLoading,
    performanceWorkflowPositionRefreshPress,
    isPerformanceWorkflowPositionEmpty,
    isPerformanceWorkflowPositionError,
    performanceWorkflowPositionTotalCount,
    performanceWorkflowPositionPage,
    performanceWorkflowPositionPagePress,
    performanceWorkflowPositionTotalPage,
    performanceWorkflowPositionSort,
    performanceWorkflowPositionSortPress,
    setPerformanceWorkflowPositionFilter,
    performanceWorkflowPositionNextFivePagePress,
    performanceWorkflowPositionPrevFivePagePress,
    performanceWorkflowPositionFirstPagePress,
    performanceWorkflowPositionLastPagePress,
  } = usePerformanceWorkflowPositions();

  const [
    isModalPerformanceWorkflowPositionDetail,
    setIsModalPerformanceWorkflowPositionDetail,
  ] = useState(false);
  const [
    isModalPerformanceWorkflowPositionEdit,
    setIsModalPerformanceWorkflowPositionEdit,
  ] = useState(false);
  const [
    modalPerformanceWorkflowPositionDetailData,
    setModalPerformanceWorkflowPositionDetailData,
  ] = useState<any>(null);
  const [
    modalPerformanceWorkflowPositionEditData,
    setModalPerformanceWorkflowPositionEditData,
  ] = useState<any>(null);

  // Modal Detail
  const modalPerformanceWorkflowPositionDetailOpenPress = useCallback(
    (performanceWorkflowPosition) => () => {
      setModalPerformanceWorkflowPositionDetailData(
        performanceWorkflowPosition.id,
      );
      setIsModalPerformanceWorkflowPositionDetail(true);
    },
    [],
  );

  const modalPerformanceWorkflowPositionDetailClosePress = useCallback(() => {
    setIsModalPerformanceWorkflowPositionDetail(false);
  }, []);

  // Modal Edit
  const modalPerformanceWorkflowPositionEditOpenPress = useCallback(
    (performanceWorkflowPosition) => () => {
      setModalPerformanceWorkflowPositionEditData(
        performanceWorkflowPosition.id,
      );
      setIsModalPerformanceWorkflowPositionEdit(true);
    },
    [],
  );

  const modalPerformanceWorkflowPositionEditClosePress = useCallback(() => {
    performanceWorkflowPositionRefreshPress();
    setIsModalPerformanceWorkflowPositionEdit(false);
  }, [performanceWorkflowPositionRefreshPress]);

  // Filter
  const formikPerformanceWorkflowPositionFilterResetPress = useCallback(
    () => formikPerformanceWorkflowPositionFilter.resetForm(),
    [formikPerformanceWorkflowPositionFilter],
  );

  return (
    <>
      <Segment className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
        {showFilter && (
           <Form onSubmit={formikPerformanceWorkflowPositionFilter.handleSubmit}>
           <Form.Group widths={'equal'}>
             <Input
               value={formikPerformanceWorkflowPositionFilter.values.code}
               placeholder={'Code'}
               label={'Code'}
               formik={formikPerformanceWorkflowPositionFilter}
               name={'code'}
             />
             <Input
               value={formikPerformanceWorkflowPositionFilter.values.name}
               placeholder={'Name'}
               label={'Name'}
               formik={formikPerformanceWorkflowPositionFilter}
               name={'name'}
             />
             <Form.Field>
               <label>&nbsp;</label>
               <Popup
                 trigger={
                   <Button
                     disabled={!formikPerformanceWorkflowPositionFilter.dirty}
                     type={'reset'}
                     onClick={
                       formikPerformanceWorkflowPositionFilterResetPress
                     }
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
             </Form.Field>
           </Form.Group>
         </Form>
        )}
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(
                isPerformanceWorkflowPositionLoading ||
                isPerformanceWorkflowPositionEmpty
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
                  width={4}
                  attribute={'code'}
                  name={'Position Code'}
                  direction={performanceWorkflowPositionSort.code}
                  onSortPress={performanceWorkflowPositionSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={8}
                  attribute={'name'}
                  name={'Position Name'}
                  direction={performanceWorkflowPositionSort.name}
                  onSortPress={performanceWorkflowPositionSortPress}
                />
                <TableHeaderCell width={2} name={'Total Layer'} />
                <Table.HeaderCell width={2} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerformanceWorkflowPositionLoading && (
                <TablePlaceholder rowCount={15} colCount={4} />
              )}
              {!isPerformanceWorkflowPositionLoading &&
                isPerformanceWorkflowPositionEmpty && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={4}>
                      {isPerformanceWorkflowPositionError
                        ? isPerformanceWorkflowPositionError.response?.data
                            ?.message || 'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
              {!isPerformanceWorkflowPositionLoading &&
                performanceWorkflowPosition?.map(
                  (performanceWorkflowPosition: any) => (
                    <Table.Row key={performanceWorkflowPosition.id}>
                      <Table.Cell>
                        {performanceWorkflowPosition.code}
                      </Table.Cell>
                      <Table.Cell>
                        {performanceWorkflowPosition.name}
                      </Table.Cell>
                      <Table.Cell>
                        {size(
                          groupBy(
                            performanceWorkflowPosition.PFWorkflowPst,
                            'level',
                          ),
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'}>
                        <Button.Group icon basic size="mini" compact>
                          <RenderGuard
                            actionKey={RightEnum.PERF_WORKFLOW_PST_VIEW}
                          >
                            <Button
                              icon={'eye'}
                              onClick={modalPerformanceWorkflowPositionDetailOpenPress(
                                performanceWorkflowPosition,
                              )}
                            />
                          </RenderGuard>
                          <RenderGuard
                            actionKey={RightEnum.PERF_WORKFLOW_PST_EDIT}
                          >
                            <Button
                              onClick={modalPerformanceWorkflowPositionEditOpenPress(
                                performanceWorkflowPosition,
                              )}
                              icon={'pencil'}
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
          {!isPerformanceWorkflowPositionLoading &&
            !isPerformanceWorkflowPositionEmpty && (
              <>
                Show <b>{performanceWorkflowPosition?.length}</b> of{' '}
                <b>{performanceWorkflowPositionTotalCount}</b> entries
                {performanceWorkflowPositionTotalPage > 1 && (
                  <TablePaginationNew
                    pagePress={performanceWorkflowPositionPagePress}
                    totalPage={performanceWorkflowPositionTotalPage}
                    activePage={performanceWorkflowPositionPage}
                    nextFivePagePress={
                      performanceWorkflowPositionNextFivePagePress
                    }
                    prevFivePagePress={
                      performanceWorkflowPositionPrevFivePagePress
                    }
                    firstPagePress={performanceWorkflowPositionFirstPagePress}
                    lastPagePress={performanceWorkflowPositionLastPagePress}
                  />
                )}
              </>
            )}
        </Segment>
        {isModalPerformanceWorkflowPositionDetail && (
          <ModalPerformanceWorkflowPositionDetail
            id={modalPerformanceWorkflowPositionDetailData}
            isOpen={isModalPerformanceWorkflowPositionDetail}
            closePress={modalPerformanceWorkflowPositionDetailClosePress}
          />
        )}
        {isModalPerformanceWorkflowPositionEdit && (
          <ModalPerformanceWorkflowPositionEdit
            id={modalPerformanceWorkflowPositionEditData}
            isOpen={isModalPerformanceWorkflowPositionEdit}
            closePress={modalPerformanceWorkflowPositionEditClosePress}
          />
        )}
      </Segment>
    </>
  );
};

export default TablePerformanceWorkflowPosition;
