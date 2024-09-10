import { useCallback } from 'react';
import useSWR from 'swr';
import axios from '../../axios';

const API_PERF_FORM_PARTICIPANT_EMP =
  '/api/performance-form/employee-participants';

export const getEmpParticipantByFormId = (
  url: string = API_PERF_FORM_PARTICIPANT_EMP,
  perfFormId: string,
) => {
  return axios.get(`${url}/${perfFormId}`).then((resp) => resp.data);
};

const useEmpParticipantByForm = (perfFormId?: string) => {
  const { data, error, mutate } = useSWR(
    perfFormId ? [API_PERF_FORM_PARTICIPANT_EMP, perfFormId] : null,
    getEmpParticipantByFormId,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    formEmpParticipant: data,
    isFormEmpParticipantLoading: !error && !data,
    isFormEmpParticipantError: error,
    formEmpParticipantRefreshPress: refreshPress,
  };
};

export default useEmpParticipantByForm;
