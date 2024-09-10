import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_POSITION = '/api/position/grouping';
const patchEditPositionGroupingTarget = (patchEditPositionGroupingTargetBody: {
  id: string;
  immediateTarget: number;
  secondaryTarget: number;
  thirdTarget: number;
}) => {
  return axios
    .patch(API_EDIT_POSITION, patchEditPositionGroupingTargetBody)
    .then((resp) => resp.data);
};

interface UsePositionGroupingTargetsEdit {
  onSuccess?: any;
}

const usePositionGroupingTargetsEdit = (
  args: UsePositionGroupingTargetsEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data}`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPositionGroupingTarget,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    positionGroupingTargetEditPosting: fetch,
    isPositionGroupingTargetEditLoading: isLoading,
  };
};

export default usePositionGroupingTargetsEdit;
