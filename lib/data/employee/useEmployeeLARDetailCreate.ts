import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EMP_LA_DETAIL_CREATE = '/api/emp-leadership-assessment/detail';
const postCreateEmpLADetail = (postCreateEmpLADetailBody: {
  empLAId: string;
  leadershipAssessmentId: string;
  finalScore: string;
  type: string;
}) => {
  return axios
    .post(API_EMP_LA_DETAIL_CREATE, postCreateEmpLADetailBody)
    .then((resp) => resp.data);
};

interface UseEmpLADetailCreate {
  onSuccess?: any;
}

const useEmployeeLARDetailCreate = (args: UseEmpLADetailCreate = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Leadership Assesment Detail has been created`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreateEmpLADetail,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    empLADetailCreatePosting: fetch,
    isEmpLADetailCreateLoading: isLoading,
  };
};

export default useEmployeeLARDetailCreate;
