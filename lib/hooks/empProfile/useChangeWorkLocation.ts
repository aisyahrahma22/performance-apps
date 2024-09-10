import { find } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useRolesByUserId from '../../data/auth/useRolesByUserId';
import useWorklocationsByHopeId from '../../data/employee/useWorklocationsByHopeId';
import { currentUserSelector, fetchAuthAuthorize } from '../../slice/auth';

const useChangeWorklocation = (closePress: any) => {
  const dispatch = useDispatch();
  const userSelector = useSelector(currentUserSelector);
  const router = useRouter();

  const [userId, setUserId] = useState(userSelector?.id);
  const [roleId, setRoleId] = useState('');
  const [selectRole, setSelectRole] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { worklocations } = useWorklocationsByHopeId();
  const { roles } = useRolesByUserId(userId, true);

  const selectedWLName = useMemo(() => {
    const selectedWL = find(worklocations, (v) => v.userId == userId);
    return selectedWL?.worklocation?.name;
  }, [worklocations, userId]);

  const selectedRoleName = useMemo(() => {
    const selecteRole = find(roles, (v) => v.id == roleId);
    return selecteRole?.name;
  }, [roles, roleId]);

  const onNext = useCallback(() => {
    setShowConfirmation(true);
  }, [userId, roleId]);

  const fetchAuthorizeChangeUser = useCallback(
    (selectedRole, selectedUser) => {
      dispatch(
        fetchAuthAuthorize({
          roleId: selectedRole,
          userId: selectedUser,
          isChangeUser: true,
          closePress: () => {
            toast.success('Change Worklocation Successfully');
            closePress();
            router.push('/');
          },
        }),
      );
    },
    [router],
  );

  const onChooseWorklocationPress = useCallback(() => {
    if (roles?.length == 1) {
      const [role] = roles;
      setRoleId(role?.id);
      setShowConfirmation(true);
    } else {
      setSelectRole(true);
    }
  }, [roles, userId, roleId]);

  const cancelChangesWL = useCallback(() => {
    setShowConfirmation(false);
    closePress();
  }, []);

  return {
    userId,
    roleId,
    setUserId,
    setRoleId,
    setSelectRole,
    selectRole,
    showConfirmation,
    selectedWLName,
    selectedRoleName,
    worklocations,
    roles,
    onNext,
    fetchAuthorizeChangeUser,
    onChooseWorklocationPress,
    cancelChangesWL,
  };
};

export default useChangeWorklocation;
