import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_SILOAM_VALUE = '/api/siloam-value';
const patchEditPerformanceSiloamValue = (patchEditPerformanceSiloamValueBody: {
  id: string;
  name: string;
  description: string;
}) => {
  return axios
    .patch(API_PERFORMANCE_SILOAM_VALUE, patchEditPerformanceSiloamValueBody)
    .then((resp) => resp.data);
};

interface UsePerformancesSiloamValueEdit {
  onSuccess?: any;
}

const usePerformancesSiloamValueEdit = (
  args: UsePerformancesSiloamValueEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data.name} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerformanceSiloamValue,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesSiloamValueEditPosting: fetch,
    isPerformancesSiloamValueEditLoading: isLoading,
  };
};

export default usePerformancesSiloamValueEdit;
