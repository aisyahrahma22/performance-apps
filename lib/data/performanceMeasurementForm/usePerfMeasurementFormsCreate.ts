import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_PERF_MEASURMENET_FORM = '/api/performance-measurement/add';
const postCreatePerfMeasurementForm = (postCreatePerfMeasurementFormBody: {
  templateCode: string;
  templateName: string;
  year: number;
  performanceType: any;
  dataGrade?: any;
}) => {
  return axios
    .post(API_CREATE_PERF_MEASURMENET_FORM, postCreatePerfMeasurementFormBody)
    .then((resp) => resp.data);
};

interface UsePerfMeasurementFormCreate {
  onSuccess?: any;
}

const usePerfMeasurementFormCreate = (
  args: UsePerfMeasurementFormCreate = {},
) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create a Performance Measurement Form data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerfMeasurementForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfMeasurementFormCreatePosting: fetch,
    isPerfMeasurementFormCreateLoading: isLoading,
  };
};

export default usePerfMeasurementFormCreate;
