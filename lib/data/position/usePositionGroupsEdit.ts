import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_POSITION_GROUPS = '/api/position/groups';
const patchEditPositionGroup = (patchEditPositionGroupBody: any) => {
  return axios
    .patch(API_EDIT_POSITION_GROUPS, patchEditPositionGroupBody)
    .then((resp) => resp.data);
};

interface UsePositionGroupsEdit {
  onSuccess?: any;
}

const usePositionGroupsEdit = (args: UsePositionGroupsEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPositionGroup,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    positionGroupsEditPosting: fetch,
    isPositionGroupsEditLoading: isLoading,
  };
};

export default usePositionGroupsEdit;
