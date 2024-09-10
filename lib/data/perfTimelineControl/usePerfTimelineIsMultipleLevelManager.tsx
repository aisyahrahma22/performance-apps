import axios from '../../axios';
import useSWR from 'swr';
import qs from 'qs';

const API_TIMELINE_MULTIPLE_MANAGER =
  '/api/timeline-control/generate-data-approver';

const getPerfTimelineMultipleManager = (url: string, filter: any) => {
  const qsp = qs.stringify(
    {
      filter,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const usePerfTimelineMultipleManager = (filter: any) => {
  const { data, error } = useSWR(
    filter ? [API_TIMELINE_MULTIPLE_MANAGER, filter] : null,
    getPerfTimelineMultipleManager,
    {
      revalidateOnMount: true,
    },
  );
  return {
    generateMultipleManagerDetails: data,
    isgenerateMultipleManagerDetailsLoading: !error && !data,
    isgenerateMultipleManagerDetailsError: error,
  };
};

export default usePerfTimelineMultipleManager;
