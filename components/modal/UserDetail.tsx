import { Button, Grid, Label, List, Modal } from 'semantic-ui-react';
import useUser from '../../lib/data/user/useUser';
import Snippet from '../Snippet';
import renderHyphen from '../../lib/util/renderHyphen';
import React, { useCallback, useState } from 'react';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import { getName } from '../../lib/util/getName';
import ModalConfirmation from '../ModalConfirmation';
import useUserRestore from '../../lib/data/user/useUserRestore';
import { last } from 'lodash';

interface ModalUserDetailProps {
  id: string;
  name?: string;
  isDeleted?: boolean;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalUserDetail = ({
  id,
  isOpen,
  name,
  isDeleted = false,
  closePress,
}: ModalUserDetailProps) => {
  const { user, isUserLoading } = useUser(id);
  const [isModalConfirm, setIsModalConfirm] = useState(false);

  const closeModalConfirm = useCallback(() => {
    setIsModalConfirm(false);
  }, [setIsModalConfirm]);

  const onSuccess = useCallback(() => {
    closeModalConfirm();
    closePress();
  }, [closeModalConfirm, closePress]);

  const { userRestore, isUserRestoreLoading } = useUserRestore({ onSuccess });

  const handleRestore = useCallback(() => {
    setIsModalConfirm(true);
  }, [setIsModalConfirm]);

  const onYesActionPress = useCallback(() => {
    userRestore({ id });
  }, [id, userRestore]);

  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        {isUserLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <Snippet
            avatarSize={'70'}
            hasAvatar
            title={getName(user) || name}
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
        {isUserLoading ? (
          <ModalContentPlaceholder />
        ) : (
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
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    User Access
                    <List.Header>
                      {user?.roles?.map((userRole: any) => (
                        <Label key={userRole.id}>{userRole.role.name}</Label>
                      ))}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            {isDeleted && (
              <Grid.Row>
                <Grid.Column>
                  <Button color="blue" onClick={handleRestore}>
                    Restore User
                  </Button>
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
      {isModalConfirm && (
        <ModalConfirmation
          open={isModalConfirm}
          onClose={closeModalConfirm}
          onAction={onYesActionPress}
          isLoading={isUserRestoreLoading}
          message={`Are you sure you want to restore this user ?`}
          keyName={'code'}
          label={'Code'}
        />
      )}
    </Modal>
  );
};

export default ModalUserDetail;
