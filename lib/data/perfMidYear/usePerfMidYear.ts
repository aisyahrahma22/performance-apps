import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_MID_YEAR = '/api/perf-mid-year';

const getPerfMidYear = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfMidYear = (id: string, isApproval = false) => {
  const url = isApproval ? `${API_PERF_MID_YEAR}/approval` : API_PERF_MID_YEAR;

  const { data, error } = useSWR(id ? [url, id] : null, getPerfMidYear, {
    revalidateOnMount: true,
  });
  return {
    perfMidYear: data,
    isPerfMidYearLoading: !error && !data,
    isPerfMidYearError: error,
  };
};

export default usePerfMidYear;
