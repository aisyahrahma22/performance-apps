import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { parse } from 'date-fns';
import { dateStringFormat } from '../../../components/DatePicker';

const API_PATCH_PERFORMANCE_PROGRAM = '/api/performance-program';

// const patchPerformanceProgram = async (values: any) => {
//   const resp = await axios.patch(API_PATCH_PERFORMANCE_PROGRAM, values);
//   return resp.data;
// };

const patchPerformanceProgram = (postCreatePerfProgramBody: any) => {
  return axios
    .patch(API_PATCH_PERFORMANCE_PROGRAM, {
      ...postCreatePerfProgramBody,
      code: postCreatePerfProgramBody.code,
      name: postCreatePerfProgramBody.name,
      formTerm: postCreatePerfProgramBody.formTerm,
      finalResultMethod: postCreatePerfProgramBody.finalResultMethod,
      formMember: postCreatePerfProgramBody.formMember,
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

interface UsePerformanceProgramEdit {
  onSuccess?: any;
}

const usePerformanceProgramEdit = (args: UsePerformanceProgramEdit = {}) => {
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
    fetcher: patchPerformanceProgram,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    performanceProgramEdit: fetch,
    isPerformanceProgramEditLoading: isLoading,
  };
};

export default usePerformanceProgramEdit;
