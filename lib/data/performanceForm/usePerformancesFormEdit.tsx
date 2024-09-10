import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { PerfFormEnum, PerfFormStatusEnum } from '../../enums/PerfForm';
import { dateStringFormat } from '../../../components/DatePicker';
import { parse } from 'date-fns';

const API_PERFORMANCE_FORM_EDIT = '/api/performance-form';
const patchEditPerformanceForm = (patchEditPerformanceBody: {
  performanceFormCode: string;
  perfFormName: any;
  finalResultCalc: PerfFormEnum;
  status: PerfFormStatusEnum;
  dataPerfType: any;
  dataEmployee?: any;
  dataPosition?: any;
  sequences: any;
}) => {
  return axios
    .patch(API_PERFORMANCE_FORM_EDIT, {
      ...patchEditPerformanceBody,
      sequences: patchEditPerformanceBody?.sequences.map((item: any) => ({
        ...item,
        startDate: parse(item.startDate, dateStringFormat, new Date()),
        endDate: parse(item.endDate, dateStringFormat, new Date()),
      })),
    })
    .then((resp) => resp.data);
};

interface UsePerformancesFormEdit {
  onSuccess?: any;
}

const usePerformancesFormEdit = (args: UsePerformancesFormEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerformanceForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesFormEditPosting: fetch,
    isPerformancesFormEditLoading: isLoading,
  };
};

export default usePerformancesFormEdit;
