import { useDispatch, useSelector } from 'react-redux';
import {
  authStateSelector,
  fetchAuthAuthorize,
  fetchAuthLogout,
} from '../../lib/slice/auth';
import React, { useCallback, useState } from 'react';
import useRoles from '../../lib/data/auth/useRoles';
import {
  Button,
  Header,
  Icon,
  List,
  Modal,
  Placeholder,
  Segment,
} from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

interface ModalChooseRoleProps {
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalChooseRolePlaceHolder = () => (
  <Placeholder fluid>
    <Placeholder.Line length={'full'} />
    <Placeholder.Line length={'full'} />
    <Placeholder.Line length={'full'} />
    <Placeholder.Line length={'full'} />
  </Placeholder>
);

const ModalChooseRole = ({ isOpen, closePress }: ModalChooseRoleProps) => {
  const dispatch = useDispatch();
  const authState = useSelector(authStateSelector);
  const { roles, isRolesLoading } = useRoles();
  const [roleId, setRoleId] = useState('');

  const noRolesAvailablePress = useCallback(() => {
    closePress();
    dispatch(fetchAuthLogout());
  }, [closePress, dispatch]);

  const onChooseRolePress: any = useCallback(
    (roleId: string) => () => {
      // dispatch(fetchAuthAuthorize({ roleId }));
      if (roleId) {
        dispatch(fetchAuthAuthorize({ roleId, closePress }));
      } else {
        toast.error('Oops! Something when wrong');
        closePress();
      }
    },
    [closePress, dispatch],
  );

  return (
    <Modal
      open={isOpen}
      size={'tiny'}
      closeIcon
      onClose={noRolesAvailablePress}
    >
      <Header
        content={'Choose User Access'}
        subheader={
          'Your account is eligible to these User Access, pick one and continue!'
        }
      />
      <Segment basic loading={authState.isAuthorizing}>
        {isEmpty(roles) && !authState.isAuthorizing && !isRolesLoading && (
          <Segment textAlign={'center'} basic>
            No roles available. Please contact your Administrator.
          </Segment>
        )}
        {isRolesLoading ? (
          <ModalChooseRolePlaceHolder />
        ) : (
          <List relaxed size={'large'} selection verticalAlign="middle">
            {roles?.map(({ role: { isActive, id, name } }: { role: any }) => (
              <List.Item
                onClick={() => setRoleId(id)}
                key={id}
                disabled={!isActive}
              >
                <List.Content floated="right" verticalAlign={'middle'}>
                  <Icon
                    name={id === roleId ? 'selected radio' : 'circle outline'}
                    color={id === roleId ? 'violet' : 'grey'}
                  />
                </List.Content>
                <List.Content>
                  <Header
                    size={'tiny'}
                    disabled={!isActive}
                    color={isActive ? 'black' : 'grey'}
                  >
                    {name}
                  </Header>
                </List.Content>
              </List.Item>
            ))}
          </List>
        )}
        <Button
          size={'large'}
          fluid
          color="violet"
          style={{ margin: '30px 0 10px 0' }}
          disabled={!roleId}
          onClick={onChooseRolePress(roleId)}
        >
          Oke
        </Button>
      </Segment>
    </Modal>
  );
};

export default ModalChooseRole;
