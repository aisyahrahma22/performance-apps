import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { PerfFormEnum, PerfFormStatusEnum } from '../../enums/PerfForm';
import { dateStringFormat } from '../../../components/DatePicker';
import { parse } from 'date-fns';

const API_PERFORMANCE = '/api/performance-form';
const postCreatePerformanceForm = (postCreatePerformanceFormBody: {
  performanceFormCode: string;
  perfFormName: any;
  finalResultCalc: PerfFormEnum;
  status: PerfFormStatusEnum;
  dataPerfType: any;
  dataEmployee?: any;
  dataPosition?: any;
  perfProgramId?: any;
  sequences: any;
}) => {
  return axios
    .post(API_PERFORMANCE, {
      ...postCreatePerformanceFormBody,
      sequences: postCreatePerformanceFormBody?.sequences.map((item: any) => ({
        ...item,
        startDate: parse(item.startDate, dateStringFormat, new Date()),
        endDate: parse(item.endDate, dateStringFormat, new Date()),
      })),
    })
    .then((resp) => resp.data);
};

interface UsePerformanceFormCreate {
  onSuccess?: any;
}

const usePerformancesCreateForm = (args: UsePerformanceFormCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create new data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformanceForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performanceFormCreatePosting: fetch,
    isPerformanceFormCreateLoading: isLoading,
  };
};

export default usePerformancesCreateForm;
