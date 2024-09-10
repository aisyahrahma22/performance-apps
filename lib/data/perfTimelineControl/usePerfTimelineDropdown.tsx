import axios from '../../axios';
import useSWR from 'swr';

const API_TIMELINE_DROPDOWN = '/api/timeline-control/dropdown';

export const getPerfTimelineDropdown = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfTimelineDropdown = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_TIMELINE_DROPDOWN, id] : null,
    getPerfTimelineDropdown,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfTimelineDropdown: data,
    isPerfTimelineDropdownLoading: !error && !data,
    isPerfTimelineDropdownError: error,
  };
};

export default usePerfTimelineDropdown;
