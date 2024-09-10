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
import Input from '../../Input';
import InputDropdownRemote from '../../InputDropdownRemote';
import { getPositions } from '../../../lib/data/position/usePositions';
import TablePaginationNew from '../../TablePaginationNew';

interface TablePositionParticipantProps {
  id: string;
  isEmployeeParticipant: boolean;
}

const TablePositionParticipant = ({
  id,
  isEmployeeParticipant,
}: TablePositionParticipantProps) => {
  const formikPerfFormParticipantFilterFilter = useFormik({
    initialValues: {
      code: '',
      name: '',
    },
    onSubmit: (values) => {
      const newFilter = {
        performanceForm: { id },
        position: { code: values.code, id: values.name },
      };

      setPerfFormParticipantFilter(newFilter);
    },
    onReset: () => {
      setPerfFormParticipantFilter({ performanceForm: { id } });
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
      performanceForm: { id },
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
              label={'Position Code'}
              formik={formikPerfFormParticipantFilterFilter}
              name={'code'}
            />
            <InputDropdownRemote
              formik={formikPerfFormParticipantFilterFilter}
              label="Position Name"
              placeholder="Position Name"
              name="name"
              apiFetcher={getPositions}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'id'}
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
                <TableHeaderCell width={4} name={'Position Code'} />
                <TableHeaderCell width={11} name={'Position Name'} />
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
                        <List>{renderHyphen(data?.position?.code)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data?.position?.code)}
                        </Table.Cell>
                      }
                    />
                    <Popup
                      content={
                        <List>{renderHyphen(data?.position?.name)}</List>
                      }
                      trigger={
                        <Table.Cell>
                          {renderHyphen(data?.position?.name)}
                        </Table.Cell>
                      }
                    />
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

export default TablePositionParticipant;
