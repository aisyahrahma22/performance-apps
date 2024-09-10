import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SCORING_GUIDELINE = '/api/scoring-guideline';

const postCreateScoringGuideline = (postCreateScoringGuidelineBody: {
  sequence: string;
  name: string;
  descriprtion: string;
  file: string;
}) => {
  return axios
    .post(API_SCORING_GUIDELINE, postCreateScoringGuidelineBody)
    .then((resp) => resp.data);
};

interface UseScoringGuidelineCreate {
  onSuccess?: any;
}

const useScoringGuidelineCreate = (args: UseScoringGuidelineCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully upload scoring guideline');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreateScoringGuideline,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    scoringGuidelineCraetePosting: fetch,
    isScoringGuidelineCreateLoading: isLoading,
  };
};

export default useScoringGuidelineCreate;
