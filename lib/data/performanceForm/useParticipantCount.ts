import { isNaN } from 'lodash';
import qs from 'qs';
import { useCallback } from 'react';
import useSWR from 'swr';
import axios from '../../axios';
import { FormMemberEnum } from '../../enums/PerformanceEnum';

const API_PERF_FORM_PARTICIPANT_COUNT =
  '/api/performance-form/participants-count';

export const getParticipantCount = (
  url: string = API_PERF_FORM_PARTICIPANT_COUNT,
  perfFormId: string,
  participantType: FormMemberEnum,
) => {
  const qsp = qs.stringify(
    {
      perfFormId,
      participantType,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useParticipantCount = (
  perfFormId: string,
  participantType: FormMemberEnum,
) => {
  const { data, error, mutate } = useSWR<number>(
    perfFormId
      ? [API_PERF_FORM_PARTICIPANT_COUNT, perfFormId, participantType]
      : null,
    getParticipantCount,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    formParticipantCount: data,
    isFormParticipantCountLoading: !error && !data && isNaN(data),
    isFormParticipantCountError: error,
    formParticipantCountRefreshPress: refreshPress,
  };
};

export default useParticipantCount;
