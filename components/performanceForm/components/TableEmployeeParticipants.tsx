import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Form,
  Icon,
  List,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import renderHyphen from '../../../lib/util/renderHyphen';
import TablePlaceholder from '../../placeholder/TablePlaceholder';
import TableHeaderCell from '../../TableHeaderCell';
import useParticipant from '../../../lib/data/performanceForm/useParticipants';
import { useFormik } from 'formik';
// import InputDropdownRemote from '../../InputDropdownRemote';
import Input from '../../Input';
import TablePaginationNew from '../../TablePaginationNew';

interface TableEmployeeParticipantProps {
  id: string;
  isEmployeeParticipant: boolean;
}

const TableEmployeeParticipant = ({
  id,
  isEmployeeParticipant,
}: TableEmployeeParticipantProps) => {
  const formikPerfFormParticipantFilterFilter = useFormik({
    initialValues: {
      code: '',
      name: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        perfFormId: id,
        employee: { code: values.code, fullName: values.name },
      };

      setPerfFormParticipantFilter(newFilter);
    },
    onReset: () => {
      setPerfFormParticipantFilter({ perfFormId: id });
    },
  });

  const {
    perfFormParticipant,
    isPerfFormParticipantEmpty,
    isPerfFormParticipantLoading,
    isPerfFormParticipantError,
    perfFormParticipantTotalCount,
    perfFormParticipantTotalPage,
    perfFormParticipantPage,
    perfFormParticipantRefreshPress,
    perfFormParticipantPagePress,
    setPerfFormParticipantFilter,
    perfFormParticipantNextFivePagePress,
    perfFormParticipantPrevFivePagePress,
    perfFormParticipantFirstPagePress,
    perfFormParticipantLastPagePress,
  } = useParticipant(isEmployeeParticipant);

  useEffect(() => {
    setPerfFormParticipantFilter({
      perfFormId: id,
    });
  }, [id, setPerfFormParticipantFilter]);

  const formikPerformanceFilterResetPress = useCallback(
    () => formikPerfFormParticipantFilterFilter.resetForm(),
    [formikPerfFormParticipantFilterFilter],
  );

  return (
    <>
      <Segment raised>
        <Form onSubmit={formikPerfFormParticipantFilterFilter.handleSubmit}>
          <Form.Group widths={'equal'}>
            <Input
              placeholder={'Code'}
              label={'Employee Code'}
              formik={formikPerfFormParticipantFilterFilter}
              name={'code'}
            />
            <Input
              placeholder={'Name'}
              label={'Employee Name'}
              formik={formikPerfFormParticipantFilterFilter}
              name={'name'}
            />
            <Form.Field>
              <label>&nbsp;</label>
              <Popup
                trigger={
                  <Button
                    disabled={!formikPerfFormParticipantFilterFilter.dirty}
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
      <Segment raised className={'nopadding hcms-table'}>
        <Segment basic clearing className={'nomargin'}>
          <Button
            size={'mini'}
            floated="right"
            onClick={perfFormParticipantRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
        </Segment>
        <div>
          <Table
            selectable={!isPerfFormParticipantLoading}
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell width={4} name={'Employee Code'} />
                <TableHeaderCell width={11} name={'Employee Name'} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isPerfFormParticipantLoading && (
                <TablePlaceholder rowCount={3} colCount={2} />
              )}
              {!isPerfFormParticipantLoading && isPerfFormParticipantEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={3}>
                    {isPerfFormParticipantError
                      ? isPerfFormParticipantError?.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isPerfFormParticipantLoading &&
                perfFormParticipant?.map((data: any, index: any) => (
                  <Table.Row key={`employee-participant-${index}`}>
                    <Popup
                      content={
                        <List>{renderHyphen(data?.employee?.code)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data?.employee?.code)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderHyphen(data?.employee?.fullName)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data?.employee?.fullName)}
                        </Table.Cell>
                      }
                    />
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isPerfFormParticipantLoading && !isPerfFormParticipantEmpty && (
            <>
              Show <b>{perfFormParticipant?.length}</b> of{' '}
              <b>{perfFormParticipantTotalCount}</b> entries
              {perfFormParticipantTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={perfFormParticipantPagePress}
                  totalPage={perfFormParticipantTotalPage}
                  activePage={perfFormParticipantPage}
                  nextFivePagePress={perfFormParticipantNextFivePagePress}
                  prevFivePagePress={perfFormParticipantPrevFivePagePress}
                  firstPagePress={perfFormParticipantFirstPagePress}
                  lastPagePress={perfFormParticipantLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
      </Segment>
    </>
  );
};

export default TableEmployeeParticipant;
