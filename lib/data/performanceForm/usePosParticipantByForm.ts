import { useCallback } from 'react';
import useSWR from 'swr';
import axios from '../../axios';

const API_PERF_FORM_PARTICIPANT_POS =
  '/api/performance-form/position-participants';

export const getPosParticipantByFormId = (
  url: string = API_PERF_FORM_PARTICIPANT_POS,
  perfFormId: string,
) => {
  return axios.get(`${url}/${perfFormId}`).then((resp) => resp.data);
};

const usePosParticipantByForm = (perfFormId?: string) => {
  const { data, error, mutate } = useSWR(
    perfFormId ? [API_PERF_FORM_PARTICIPANT_POS, perfFormId] : null,
    getPosParticipantByFormId,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    formPosParticipant: data,
    isFormPosParticipantLoading: !error && !data,
    isFormPosParticipantError: error,
    formPosParticipantRefreshPress: refreshPress,
  };
};

export default usePosParticipantByForm;
