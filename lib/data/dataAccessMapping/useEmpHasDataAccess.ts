import { useSelector } from 'react-redux';
import { RightEnum } from '../../enums/RightEnum';
import {
  currentActionsSelector,
  currentHasAccessMappingSelector,
} from '../../slice/auth';

const useEmpHasDataAccess = () => {
  const currentActions = useSelector(currentActionsSelector);
  const hasAccessMapping = useSelector(currentHasAccessMappingSelector);

  return {
    isValidAccess:
      hasAccessMapping ||
      currentActions?.includes(RightEnum.DASHBOARD_ALL_ACCESS),
    /**
     * 1. User can only see data that already mapped to their position (isRequiredAccessMapping will be set to True)
     * 2. User with Role Superadmin (with RightEnum dashboard_all_access) will be set to False
     */
    isRequiredAccessMapping: currentActions?.includes(
      RightEnum.DASHBOARD_ALL_ACCESS,
    )
      ? false
      : hasAccessMapping,
  };
};

export default useEmpHasDataAccess;
