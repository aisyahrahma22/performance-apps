import { useSelector } from 'react-redux';
import { RightEnum } from '../../enums/RightEnum';
import { currentActionsSelector } from '../../slice/auth';
import { dataAccessSelector } from '../../slice/dataAccessMapping';

const usePosEmpDataAccessMapping = () => {
  const currentActions = useSelector(currentActionsSelector);
  const dataMapping = useSelector(dataAccessSelector);
  // const dispatch = useDispatch();
  // const { dataAccessMapping: dataMapping } = useDataAccessMappingId();

  // if (dataMapping.length == 0) {
  //   dispatch(updateAuthDataMapping(dataAccessMapping));
  // }

  return {
    positionCode: currentActions?.includes(RightEnum.DASHBOARD_ALL_ACCESS)
      ? []
      : dataMapping,
    isValidAccess:
      dataMapping?.length ||
      currentActions?.includes(RightEnum.DASHBOARD_ALL_ACCESS)
        ? true
        : false,
  };
};

export default usePosEmpDataAccessMapping;
