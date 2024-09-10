import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_PERF_MEASURMENET_FINAL_ADD =
  '/api/performance-measurement/final';
const postCreatePerfMeasurementFinal = (postCreatePerfMeasurementFinalBody: {
  measurementCode: string;
  measurementName: string;
  year: number;
  dataGradeFinal?: any;
}) => {
  return axios
    .post(
      API_CREATE_PERF_MEASURMENET_FINAL_ADD,
      postCreatePerfMeasurementFinalBody,
    )
    .then((resp) => resp.data);
};

interface UsePerfMeasurementFinalCreate {
  onSuccess?: any;
}

const usePerfMeasurementFinalCreate = (
  args: UsePerfMeasurementFinalCreate = {},
) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(
      'Successfully create a Performance Measurement Final Result data',
    );
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerfMeasurementFinal,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfMeasurementFinalCreatePosting: fetch,
    isPerfMeasurementFinalCreateLoading: isLoading,
  };
};

export default usePerfMeasurementFinalCreate;
