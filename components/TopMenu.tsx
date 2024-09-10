import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Icon, Card, Popup, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Snippet from './Snippet';
import ModalProfileDetail from './modal/ProfileDetail';
import ModalProfileChangePassword from './modal/ProfileChangePassword';
import ModalEmployeeDetail from './modal/EmployeeDetail';
import SessionTimeOut from './sessionTimeOut/SessionTimeOut';
import Clock from './Clock';
import { menuStateSelector, updateSlicer } from '../lib/slice/dashboardMenu';
import { currentEmployeeSelector, currentRoleSelector, currentTokenExpiration, currentUserSelector, fetchAuthLogout } from '../lib/slice/auth';
import { RightEnum } from '../lib/enums/RightEnum';
import { RenderGuard } from './RenderGuard';
import { isEmpty, last } from 'lodash';

const TopMenu = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserSelector);
  const employee = useSelector(currentEmployeeSelector);
  const currentRole = useSelector(currentRoleSelector);
  const tokenExpiration = useSelector(currentTokenExpiration);
  const dashboardMenu = useSelector(menuStateSelector);
  const [isPopupProfile, setIsPopupProfile] = useState(false);
  const [isModalProfile, setIsModalProfile] = useState(false);
  const [isModalProfileChangePassword, setIsModalProfileChangePassword] = useState(false);
  const [showModalChangeWL, setShowModalChangeWL] = useState(false);

  const isEligibleToChangeWL = useMemo(
    () => !!currentUser?.hopeId && !!employee?.workLocation?.name,
    [currentUser?.hopeId, employee?.workLocation?.name]
  );

  const openModalChangeWL = useCallback(() => setShowModalChangeWL(true), []);
  const closeModalChangeWL = useCallback(() => setShowModalChangeWL(false), []);
  const openModalProfile = useCallback(() => setIsModalProfile(true), []);
  const closeModalProfile = useCallback(() => setIsModalProfile(false), []);
  const openModalProfileChangePassword = useCallback(() => setIsModalProfileChangePassword(true), []);
  const closeModalProfileChangePassword = useCallback(() => setIsModalProfileChangePassword(false), []);
  const togglePopupProfile = useCallback(() => setIsPopupProfile(p => !p), []);

  const handleLogout = useCallback(async () => {
    setIsPopupProfile(false);
    await dispatch(fetchAuthLogout());
    router.replace('/login');
  }, [dispatch, router]);

  const handleClickMenu = (menu: any) => {
    dispatch(updateSlicer({ menu }));
  };

  return (
    <>
      <Menu fixed="top" borderless size="huge">
        <Menu.Menu position="right">
          {isEligibleToChangeWL && (
            <Menu.Item onClick={openModalChangeWL}>
              <Icon name="home" />
              {employee?.workLocation?.name}
            </Menu.Item>
          )}
          <Menu.Item>
            <RenderGuard actionKey={RightEnum.USER_EMP_CLOCK}>
              <Clock />
            </RenderGuard>
            <SessionTimeOut />
          </Menu.Item>
          <Menu.Item link>
            <Popup
              onClose={togglePopupProfile}
              as={Card}
              open={isPopupProfile}
              trigger={
                <Snippet
                  onClick={togglePopupProfile}
                  avatarSize="30"
                  // hasAvatar
                  title={employee?.fullName || employee?.username || currentUser?.username}
                  size="small"
                  src={employee?.profilePath ? `/api/employee/profile/download/${last(employee?.profilePath.split('/'))}` : ''}
                />
              }
              content={
                <>
                  <Card.Content>
                    <Menu secondary vertical>
                      <Menu.Item onClick={openModalProfile}>
                        <Icon name="user" /> Profile 
                        </Menu.Item>
                      <Menu.Item onClick={openModalProfileChangePassword}>
                      <Icon name="lock" /> Change Password 
                      </Menu.Item>
                    </Menu>
                    <Button
                      size="mini"
                      floated="right"
                      icon
                      labelPosition="right"
                      color="black"
                      onClick={handleLogout}
                    >
                      Logout
                      <Icon name="sign out" />
                    </Button>
                  </Card.Content>
                </>
              }
              on="click"
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {isModalProfile && isEmpty(employee) ? (
        <ModalProfileDetail
          isOpen={isModalProfile}
          closePress={closeModalProfile}
        />
      ) : (
        isModalProfile && !isEmpty(employee) && (
          <ModalEmployeeDetail
            id={employee?.id}
            isOpen={isModalProfile}
            closePress={closeModalProfile}
            hiddenTabs={['employeeTalentReview']}
            currentUser
          />
        )
      )}
      <ModalProfileChangePassword
        isOpen={isModalProfileChangePassword}
        closePress={closeModalProfileChangePassword}
      />
    </>
  );
};

export default TopMenu;
