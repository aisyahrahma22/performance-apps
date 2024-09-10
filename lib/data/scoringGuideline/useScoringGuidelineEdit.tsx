import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SCORING_GUIDELINE = '/api/scoring-guideline';
const patchEditScoringGuideline = (patchEditScoringGuidelineBody: {
  sequence: string;
  name: string;
  descriprtion: string;
  file: string;
}) => {
  return axios
    .patch(API_SCORING_GUIDELINE, patchEditScoringGuidelineBody)
    .then((resp) => resp.data);
};

interface UseScoringGuidelineEdit {
  onSuccess?: any;
}

const useScoringGuidelineEdit = (args: UseScoringGuidelineEdit = {}) => {
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
    fetcher: patchEditScoringGuideline,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    scoringGuidelineEditPosting: fetch,
    isScoringGuidelineEditLoading: isLoading,
  };
};

export default useScoringGuidelineEdit;
