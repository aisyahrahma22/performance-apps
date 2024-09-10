import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { parse } from 'date-fns';
import { dateStringFormat } from '../../../components/DatePicker';

const API_PERFORMANCE_PROGRAM = '/api/performance-program';
// const postCreatePerformanceProgram = async (values: any) => {
//   const resp = await axios.post(API_PERFORMANCE_PROGRAM, values);
//   return resp.data;
// };

interface PerfProgramRequestData {
  PerfProgramTimelineRequestData: any;
  code: string;
  name: string;
  formTerm?: string;
  finalResultMethod?: string;
  formMember?: string;
  startDate: string;
  endDate: string;
}

const postCreatePerformanceProgram = (
  postCreatePerfProgramBody: PerfProgramRequestData,
) => {
  return axios
    .post(API_PERFORMANCE_PROGRAM, {
      ...postCreatePerfProgramBody,
      startDate: parse(
        postCreatePerfProgramBody.startDate,
        dateStringFormat,
        new Date(),
      ),
      endDate: parse(
        postCreatePerfProgramBody.endDate,
        dateStringFormat,
        new Date(),
      ),
    })
    .then((resp) => resp.data);
};

interface UsePerformancesProgramCreate {
  onSuccess?: any;
}

const usePerformancesProgramCreate = (
  args: UsePerformancesProgramCreate = {},
) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create Performance Program');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformanceProgram,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesProgramCreatePosting: fetch,
    isPerformancesProgramCreateLoading: isLoading,
  };
};

export default usePerformancesProgramCreate;
