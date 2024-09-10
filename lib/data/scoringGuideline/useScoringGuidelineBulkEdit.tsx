import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SCORING_GUIDELINE = '/api/scoring-guideline/sequence';
const patchBulkEditScoringGuideline = (
  patchBulkEditScoringGuidelineBody: {
    id: string;
    sequence: string;
  }[],
) => {
  return axios
    .patch(API_SCORING_GUIDELINE, patchBulkEditScoringGuidelineBody)
    .then((resp) => resp.data);
};

interface UseScoringGuidelineBulkEdit {
  onSuccess?: any;
}

const useScoringGuidelineBulkEdit = (
  args: UseScoringGuidelineBulkEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Sequence has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchBulkEditScoringGuideline,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    scoringGuidelineBulkEditPosting: fetch,
    isScoringGuidelineBulkEditLoading: isLoading,
  };
};

export default useScoringGuidelineBulkEdit;
