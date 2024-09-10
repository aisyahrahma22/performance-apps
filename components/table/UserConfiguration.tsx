import { Button, Form, Icon, Popup, Segment, Table } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import TableHeaderCell from '../TableHeaderCell';
import useUserConfiguration from '../../lib/data/user/useUserConfiguration';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { useFormik } from 'formik';
import Input from '../Input';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import ModalSystemConfigurationEdit from '../modal/SystemConfigurationEdit';
import TablePaginationNew from '../TablePaginationNew';

interface TableUserConfigurationProps {
  showFilter?: boolean;
}

const TableUserConfiguration = ({
  showFilter = false,
}: TableUserConfigurationProps) => {
  const formikUserConfigurationFilter = useFormik({
    initialValues: {
      name: '',
      code: '',
    },
    onSubmit: (values) => {
      setUserConfigurationFilter({
        ...values,
      });
    },
    onReset: () => {
      setUserConfigurationFilter({});
    },
  });
  const {
    userConfiguration,
    isUserConfigurationLoading,
    userConfigurationRefreshPress,
    isUserConfigurationEmpty,
    isUserConfigurationError,
    userConfigurationTotalCount,
    userConfigurationPage,
    userConfigurationPagePress,
    userConfigurationTotalPage,
    userConfigurationSort,
    userConfigurationSortPress,
    setUserConfigurationFilter,
    userConfigurationNextFivePagePress,
    userConfigurationPrevFivePagePress,
    userConfigurationFirstPagePress,
    userConfigurationLastPagePress,
  } = useUserConfiguration();

  const [isModalUserConfig, setIsModalUserConfig] = useState(false);
  const [modalUserConfigurationData, setModalUserConfigurationData] =
    useState<any>(null);

  // Filter
  const formikUserConfigurationFilterResetPress = useCallback(
    () => formikUserConfigurationFilter.resetForm(),
    [formikUserConfigurationFilter],
  );

  // Modal Config
  const modalUserConfigOpenPress = useCallback((code) => {
    setModalUserConfigurationData(code);
    setIsModalUserConfig(true);
  }, []);

  const modalUserConfigClosePress = useCallback(() => {
    userConfigurationRefreshPress();
    setIsModalUserConfig(false);
  }, [userConfigurationRefreshPress]);

  return (
    <>
      {showFilter && (
        <Segment raised>
          <Form onSubmit={formikUserConfigurationFilter.handleSubmit}>
            <Form.Group widths={'equal'}>
              <Input
                value={formikUserConfigurationFilter.values.code}
                placeholder={'Code'}
                label={'Code'}
                formik={formikUserConfigurationFilter}
                name={'code'}
              />
              <Input
                value={formikUserConfigurationFilter.values.name}
                placeholder={'Name'}
                label={'Name'}
                formik={formikUserConfigurationFilter}
                name={'name'}
              />
              <Form.Field>
                <label>&nbsp;</label>
                <Popup
                  trigger={
                    <Button
                      disabled={!formikUserConfigurationFilter.dirty}
                      type={'reset'}
                      onClick={formikUserConfigurationFilterResetPress}
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
      )}
      <Segment raised className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={userConfigurationRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={
              !(isUserConfigurationLoading || isUserConfigurationEmpty)
            }
            className={'nomargin'}
            color={'teal'}
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
                  name={'Code'}
                  direction={userConfigurationSort.code}
                  onSortPress={userConfigurationSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={8}
                  attribute={'name'}
                  name={'Name'}
                  direction={userConfigurationSort.name}
                  onSortPress={userConfigurationSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={5}
                  attribute={'description'}
                  name={'Description'}
                  direction={userConfigurationSort.description}
                  onSortPress={userConfigurationSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={3}
                  attribute={'value'}
                  name={'Value'}
                  direction={userConfigurationSort.value}
                  onSortPress={userConfigurationSortPress}
                />
                <Table.HeaderCell width={2} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isUserConfigurationLoading && (
                <TablePlaceholder rowCount={15} colCount={4} />
              )}
              {!isUserConfigurationLoading && isUserConfigurationEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={4}>
                    {isUserConfigurationError
                      ? isUserConfigurationError.response?.data?.message ||
                        'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isUserConfigurationLoading &&
                userConfiguration?.map((data: any) => (
                  <Table.Row key={data.id}>
                    <Table.Cell>{data.code}</Table.Cell>
                    <Table.Cell>{data.name}</Table.Cell>
                    <Table.Cell>{data.description}</Table.Cell>
                    <Table.Cell>{data.value}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <RenderGuard
                          actionKey={RightEnum.SYSTEM_CONFIGURATION_EDIT}
                        >
                          <Button
                            onClick={() => modalUserConfigOpenPress(data.code)}
                            icon={'pencil'}
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
          {!isUserConfigurationLoading && !isUserConfigurationEmpty && (
            <>
              Show <b>{userConfiguration?.length}</b> of{' '}
              <b>{userConfigurationTotalCount}</b> entries
              {userConfigurationTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={userConfigurationPagePress}
                  totalPage={userConfigurationTotalPage}
                  activePage={userConfigurationPage}
                  nextFivePagePress={userConfigurationNextFivePagePress}
                  prevFivePagePress={userConfigurationPrevFivePagePress}
                  firstPagePress={userConfigurationFirstPagePress}
                  lastPagePress={userConfigurationLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        {
          <ModalSystemConfigurationEdit
            code={modalUserConfigurationData}
            isOpen={isModalUserConfig}
            closePress={modalUserConfigClosePress}
          />
        }
      </Segment>
    </>
  );
};

export default TableUserConfiguration;
