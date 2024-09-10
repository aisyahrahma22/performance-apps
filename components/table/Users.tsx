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
import { filter, includes, last } from 'lodash';
import renderHyphen from '../../lib/util/renderHyphen';
import Avatar from 'react-avatar';
import ModalUserDetail from '../modal/UserDetail';
import { useFormik } from 'formik';
import useUsers from '../../lib/data/user/useUsers';
import ModalUserEdit from '../modal/UserEdit';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { getName } from '../../lib/util/getName';
import StatusToggle from '../StatusToggle';
import TablePaginationNew from '../TablePaginationNew';

interface TableUsersProps {
  showFilter?: boolean;
}

const TableUsers = ({ showFilter = false }: TableUsersProps) => {
  const formikUsersFilter = useFormik({
    initialValues: {
      username: '',
      employeeEmail: '',
      employeeCode: '',
      employeeFullName: '',
    },
    onSubmit: (values) => {
      const hasEmployeeFilter =
        values.employeeEmail || values.employeeCode || values.employeeFullName;
      const newFilter = {
        username: values.username,
        employee: hasEmployeeFilter
          ? {
              email: values.employeeEmail,
              code: values.employeeCode,
              fullName: values.employeeFullName,
            }
          : undefined,
      };
      setUsersFilter(newFilter);
    },
    onReset: () => {
      setUsersFilter({});
    },
  });

  const {
    users,
    isUsersEmpty,
    isUsersLoading,
    isUsersError,
    usersTotalCount,
    usersTotalPage,
    setUsersFilter,
    usersRefreshPress,
    usersPage,
    usersPagePress,
    usersSort,
    usersSortPress,
    usersWithDeleted,
    setUsersWithDeleted,
    usersSelectOnePress,
    usersSelectAllPress,
    usersSelected,
    isUsersSelectedAll,
    usersDeletePress,
    usersNextFivePagePress,
    usersPrevFivePagePress,
    usersFirstPagePress,
    usersLastPagePress,
  } = useUsers();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalUserDetail, setIsModalUserDetail] = useState(false);
  const [isModalUserEdit, setIsModalUserEdit] = useState(false);

  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const [modalUserDetailData, setModalUserDetailData] = useState<any>(null);
  const [modalUserEditData, setModalUserEditData] = useState<any>(null);

  // Modal Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    usersDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, usersDeletePress]);

  const deleteOnePress = useCallback(
    (user) => () => {
      usersSelectAllPress(false)();
      setModalDeleteData([user]);
      setIsModalDelete(true);
    },
    [usersSelectAllPress],
  );

  const deleteAllPress = useCallback(() => {
    if (isUsersSelectedAll) setModalDeleteData([]);
    else
      setModalDeleteData(
        filter(users, (u: any) => includes(usersSelected, u.id)),
      );
    setIsModalDelete(true);
  }, [usersSelected, users, isUsersSelectedAll]);

  // Modal Detail
  const modalUserDetailOpenPress = useCallback(
    (user) => () => {
      setModalUserDetailData(user);
      setIsModalUserDetail(true);
    },
    [],
  );

  const modalUserDetailClosePress = useCallback(() => {
    setIsModalUserDetail(false);
    usersRefreshPress();
  }, [usersRefreshPress]);

  // Modal Edit
  const modalUserEditOpenPress = useCallback(
    (user) => () => {
      setModalUserEditData(user.id);
      setIsModalUserEdit(true);
    },
    [],
  );

  const modalUserEditClosePress = useCallback(() => {
    usersRefreshPress();
    setIsModalUserEdit(false);
  }, [usersRefreshPress]);

  // Filter
  const formikUsersFilterResetPress = useCallback(
    () => formikUsersFilter.resetForm(),
    [formikUsersFilter],
  );

  const toggleWithDeleted = useCallback(() => {
    setUsersWithDeleted(!usersWithDeleted);
    usersRefreshPress();
  }, [setUsersWithDeleted, usersRefreshPress, usersWithDeleted]);

  const isDeleted = useCallback((user) => user.deletedAt, []);

  return (
    <>
      {showFilter && (
        <Segment raised>
          <Form onSubmit={formikUsersFilter.handleSubmit}>
            <Form.Group widths={'equal'}>
              <Input
                value={formikUsersFilter.values.username}
                placeholder={'Username'}
                label={'Username'}
                formik={formikUsersFilter}
                name={'username'}
              />
              <Input
                value={formikUsersFilter.values.employeeCode}
                placeholder={'Employee ID'}
                label={'Employee ID'}
                formik={formikUsersFilter}
                name={'employeeCode'}
              />
              <Input
                value={formikUsersFilter.values.employeeFullName}
                placeholder={'Employee Name'}
                label={'Employee Name'}
                formik={formikUsersFilter}
                name={'employeeFullName'}
              />
              <Input
                value={formikUsersFilter.values.employeeEmail}
                placeholder={'Employee Email'}
                label={'Employee Email'}
                formik={formikUsersFilter}
                name={'employeeEmail'}
              />
              <Form.Field>
                <label>&nbsp;</label>
                <Popup
                  trigger={
                    <Button
                      disabled={!formikUsersFilter.dirty}
                      type={'reset'}
                      onClick={formikUsersFilterResetPress}
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
          {isUsersSelectedAll || usersSelected.length ? (
            <Button
              onClick={deleteAllPress}
              size={'tiny'}
              negative
              icon
              labelPosition={'left'}
            >
              Delete (
              {isUsersSelectedAll ? usersTotalCount : usersSelected.length})
              <Icon name={'trash'} />
            </Button>
          ) : null}
          <Button
            size={'tiny'}
            floated="right"
            onClick={usersRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <Popup
            content="Show Deleted Users"
            trigger={
              <Button
                size={'tiny'}
                floated="right"
                onClick={toggleWithDeleted}
                basic
                icon
              >
                <StatusToggle active={usersWithDeleted} />
              </Button>
            }
          />
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isUsersLoading || isUsersEmpty)}
            className={'nomargin'}
            color={'teal'}
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
                    disabled={isUsersEmpty}
                    onClick={usersSelectAllPress()}
                    size={'large'}
                    name={
                      isUsersSelectedAll
                        ? 'check square outline'
                        : usersSelected.length > 0
                        ? 'minus square outline'
                        : 'square outline'
                    }
                  />
                </Table.HeaderCell>
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'username'}
                  name={'Username'}
                  direction={usersSort?.username}
                  onSortPress={usersSortPress as any}
                />
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'employee.code'}
                  name={'Employee ID'}
                  direction={usersSort?.employee?.code}
                  onSortPress={usersSortPress as any}
                />
                <TableHeaderCell
                  width={3}
                  sortable
                  attribute={'employee.fullName'}
                  name={'Employee Name'}
                  direction={usersSort?.employee?.fullName}
                  onSortPress={usersSortPress as any}
                />
                <TableHeaderCell
                  width={4}
                  sortable
                  attribute={'employee.email'}
                  name={'Employee Email'}
                  direction={usersSort?.employee?.email}
                  onSortPress={usersSortPress as any}
                />
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isUsersLoading && (
                <TablePlaceholder rowCount={15} colCount={6} />
              )}
              {!isUsersLoading && isUsersEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={6}>
                    {isUsersError
                      ? isUsersError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isUsersLoading &&
                users?.map((user: any) => (
                  <Table.Row key={user.id}>
                    <Table.Cell textAlign={'center'}>
                      <Icon
                        onClick={usersSelectOnePress(user.id)}
                        size={'large'}
                        name={
                          isUsersSelectedAll || includes(usersSelected, user.id)
                            ? 'check square outline'
                            : 'square outline'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(user.username)}</Table.Cell>
                    <Table.Cell>{renderHyphen(user.employee?.code)}</Table.Cell>
                    <Table.Cell>{renderHyphen(getName(user))}</Table.Cell>
                    <Table.Cell>
                      {renderHyphen(user.employee?.email)}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <Button
                          onClick={modalUserDetailOpenPress(user)}
                          icon={'eye'}
                        />
                        {!isDeleted(user) && (
                          <>
                            {' '}
                            <Button
                              onClick={modalUserEditOpenPress(user)}
                              icon={'pencil'}
                            />
                            <Button
                              onClick={deleteOnePress(user)}
                              icon={'trash'}
                            />
                          </>
                        )}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isUsersLoading && !isUsersEmpty && (
            <>
              Show <b>{users?.length}</b> of <b>{usersTotalCount}</b> entries
              {usersTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={usersPagePress}
                  totalPage={usersTotalPage}
                  activePage={usersPage}
                  nextFivePagePress={usersNextFivePagePress}
                  prevFivePagePress={usersPrevFivePagePress}
                  firstPagePress={usersFirstPagePress}
                  lastPagePress={usersLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
          <Modal.Header>
            <Icon name={'trash'} inverted circular color={'teal'} />
            <span style={{ marginLeft: '.7em' }}>Delete User</span>
          </Modal.Header>
          <Modal.Content>
            <span>
              Are you sure want to delete{' '}
              {isUsersSelectedAll
                ? `ALL USERS with total ${usersTotalCount} users`
                : modalDeleteData.length > 1
                ? 'these users'
                : 'this user'}
              ?
            </span>
            {!isUsersSelectedAll && (
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
                      <Grid.Column width={'one'} verticalAlign={'middle'}>
                        <Avatar
                          className={'avatar'}
                          size={'30'}
                          round
                          name={getName(data)}
                          src={
                            data?.employee?.profilePath
                              ? `/api/employee/profile/download/${last(
                                  data?.employee?.profilePath.split('/'),
                                )}`
                              : ''
                          }
                        />
                      </Grid.Column>
                      <Grid.Column
                        width={'ten'}
                        style={{ marginLeft: '.7em' }}
                        verticalAlign={'middle'}
                      >
                        <List.Content>
                          <List.Header style={{ marginBottom: '.3em' }}>
                            {getName(data)}
                          </List.Header>
                          {data.employee?.email}
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
                  <Icon name="remove" /> No
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid primary onClick={modalDeleteYesPress}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
        {isModalUserDetail && (
          <ModalUserDetail
            id={modalUserDetailData?.id}
            name={getName(modalUserDetailData)}
            isDeleted={isDeleted(modalUserDetailData)}
            isOpen={isModalUserDetail}
            closePress={modalUserDetailClosePress}
          />
        )}
        {isModalUserEdit && (
          <ModalUserEdit
            id={modalUserEditData}
            isOpen={isModalUserEdit}
            closePress={modalUserEditClosePress}
          />
        )}
      </Segment>
    </>
  );
};

export default TableUsers;
