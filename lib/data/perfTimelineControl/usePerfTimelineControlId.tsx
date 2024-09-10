import axios from '../../axios';
import useSWR from 'swr';

const API_TIMELINE_CONTROL_ID = '/api/timeline-control';

export const getPerfTimelineControlId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfTimelineControlId = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_TIMELINE_CONTROL_ID, id] : null,
    getPerfTimelineControlId,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfTimelineControl: data,
    isPerfTimelineControlLoading: !error && !data,
    isPerfTimelineControlError: error,
  };
};

export default usePerfTimelineControlId;
