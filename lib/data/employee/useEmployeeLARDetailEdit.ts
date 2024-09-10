import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EMP_LAD_EDIT = '/api/emp-leadership-assessment/detail';
const patchEditEmpLADetail = (patchEditEmpLADetailBody: {
  id: string;
  leadershipAssessmentId: string;
  finalScore: string;
  type: string;
}) => {
  return axios
    .patch(API_EMP_LAD_EDIT, patchEditEmpLADetailBody)
    .then((resp) => resp.data);
};

interface UseEmpLADetailEdit {
  onSuccess?: any;
}

const useEmployeeLARDetailEdit = (args: UseEmpLADetailEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Leadership Assesment Detail has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditEmpLADetail,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    empLADetailEditPosting: fetch,
    isEmpLADetailEditLoading: isLoading,
  };
};

export default useEmployeeLARDetailEdit;
