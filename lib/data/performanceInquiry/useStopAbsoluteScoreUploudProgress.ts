import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_STOP_UPLOUD_UBSOLUTE_SCORE = '/api/performance-inquiry/stop';

const stopUploudAbsScore = (id: string) => {
  return axios
    .post(`${API_STOP_UPLOUD_UBSOLUTE_SCORE}/${id}`)
    .then((resp) => resp.data);
};

interface UseStopProgressUploudAbsScoreProps {
  onSuccess?: any;
}

const useStopProgressUploudAbsScore = (
  args: UseStopProgressUploudAbsScoreProps = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: stopUploudAbsScore,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    stopProgressUploudAbsScore: fetch,
    isStopProgressUploudAbsScoreLoading: isLoading,
  };
};

export default useStopProgressUploudAbsScore;
