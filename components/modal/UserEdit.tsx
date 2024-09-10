import { Button, Form, Grid, Icon, List, Modal } from 'semantic-ui-react';
import React, { useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useUser from '../../lib/data/user/useUser';
import Snippet from '../Snippet';
import renderHyphen from '../../lib/util/renderHyphen';
import useUserEdit from '../../lib/data/user/useUserEdit';
import InputDropdownRemoteMultiple from '../InputDropdownRemoteMultiple';
import { getRoles } from '../../lib/data/role/useRoles';
import useForgotPassword from '../../lib/data/auth/useForgotPassword';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import { getName } from '../../lib/util/getName';
import { last } from 'lodash';

interface ModalUserEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formUserEditSchema = yup.object({
  roles: yup
    .array()
    .min(1, 'Minimal 1 User Access has to be selected')
    .required('User Access is required'),
});

const ModalUserEdit = ({ id, isOpen, closePress }: ModalUserEditProps) => {
  const { user, isUserLoading } = useUser(id);

  const initialRoles = useMemo(() => {
    return (
      user?.roles?.map((role: any) => ({
        key: role.role.id,
        value: role.role.id,
        text: role.role.name,
      })) || []
    );
  }, [user]);

  const { forgotPasswordPosting, isForgotPasswordLoading } = useForgotPassword({
    onSuccess: closePress,
  });

  const resetPasswordPress = useCallback(() => {
    forgotPasswordPosting({ usernameOrEmail: user.username });
  }, [forgotPasswordPosting, user]);

  const { userEditPatch, isUserEditLoading } = useUserEdit({
    onSuccess: closePress,
  });

  const formikUserEdit = useFormik({
    initialValues: {
      roles: initialRoles.map((role: any) => role.key),
    },
    onSubmit: (values) => {
      userEditPatch({
        id: user.id,
        ...values,
      });
    },
    validationSchema: formUserEditSchema,
    enableReinitialize: true,
  });

  return (
    <Modal open={isOpen} size="tiny">
      <Modal.Header>
        {isUserLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <Snippet
            avatarSize={'70'}
            hasAvatar
            title={getName(user)}
            description={user?.employee?.jobTitle?.name}
            src={
              user?.employee?.profilePath
                ? `/api/employee/profile/download/${last(
                    user?.employee.profilePath.split('/'),
                  )}`
                : ''
            }
          />
        )}
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'user-edit-form'}
          loading={
            isUserEditLoading || isUserLoading || isForgotPasswordLoading
          }
        >
          <Grid columns={'equal'} textAlign={'left'}>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Employee ID
                    <List.Header>
                      {renderHyphen(user?.employee?.code)}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Employee NO
                    <List.Header>
                      {renderHyphen(user?.employee?.no)}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Email
                    <List.Header>
                      {renderHyphen(user?.employee?.email)}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div className={'wrapper-form-list'}>
            <InputDropdownRemoteMultiple
              placeholder={'User Access'}
              label={'User Access'}
              name={'roles'}
              formik={formikUserEdit}
              apiFilter={{
                isActive: true,
              }}
              apiFetcher={getRoles}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'id'}
              initialOptions={initialRoles}
            />
            <Button
              onClick={resetPasswordPress}
              compact
              basic
              info
              type={'button'}
            >
              <Icon name={'send'} />
              Reset Password
            </Button>
          </div>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Button size={'large'} onClick={closePress} fluid type={'button'}>
                <Icon name={'close'} />
                Close
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                primary
                fluid
                size={'large'}
                onClick={formikUserEdit.handleSubmit as any}
                form={'user-edit-form'}
              >
                <Icon name={'save'} />
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalUserEdit;
