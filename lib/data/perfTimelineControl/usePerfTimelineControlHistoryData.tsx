import axios from '../../axios';
import useSWR from 'swr';

const API_TIMELINE_CONTROL_HISTORY = '/api/timeline-control/history';

export const getPerfTimelineControlHistory = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfTimelineControlHistory = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_TIMELINE_CONTROL_HISTORY, id] : null,
    getPerfTimelineControlHistory,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfTimelineControlHistory: data,
    isPerfTimelineControlHistoryLoading: !error && !data,
    isPerfTimelineControlHistoryError: error,
  };
};

export default usePerfTimelineControlHistory;
