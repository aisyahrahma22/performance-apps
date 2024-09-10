import { Button, Grid, List, Modal } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import Snippet from '../Snippet';
import { isEmpty, last } from 'lodash';
import { useSelector } from 'react-redux';
import {
  currentEmployeeSelector,
  currentUserSelector,
} from '../../lib/slice/auth';
import ModalProfileChangePassword from './ProfileChangePassword';

interface ModalProfileDetailProps {
  isOpen: boolean;
  closePress: any;
}

const ModalProfileDetail = ({
  isOpen,
  closePress,
}: ModalProfileDetailProps) => {
  const [isModalProfileChangePassword, setIsModalProfileChangePassword] =
    useState(false);

  const currentUser = useSelector(currentUserSelector);
  const currentEmployee = useSelector(currentEmployeeSelector);

  const modalProfileChangePasswordClosePress = useCallback(() => {
    setIsModalProfileChangePassword(false);
  }, []);

  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        <Snippet
          avatarSize={'70'}
          hasAvatar
          title={currentEmployee.fullName || currentUser.username}
          description={currentEmployee.jobTitle?.name}
          src={
            currentEmployee?.employee?.profilePath
              ? `/api/employee/profile/download/${last(
                  currentEmployee.employee.profilePath.split('/'),
                )}`
              : ''
          }
        />
      </Modal.Header>
      <Modal.Content>
        {!isEmpty(currentEmployee) && (
          <Grid columns={'equal'} textAlign={'left'}>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Employee ID
                    <List.Header>{currentEmployee.code}</List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Employee NO
                    <List.Header>{currentEmployee.no}</List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Email
                    <List.Header>{currentEmployee.email}</List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
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
      <ModalProfileChangePassword
        isOpen={isModalProfileChangePassword}
        closePress={modalProfileChangePasswordClosePress}
      />
    </Modal>
  );
};

export default ModalProfileDetail;
