import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_END_YEAR = '/api/perf-end-year';

const getPerfEndYear = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfEndYear = (id: string, isApproval = false) => {
  const url = isApproval ? `${API_PERF_END_YEAR}/approval` : API_PERF_END_YEAR;

  const { data, error } = useSWR(id ? [url, id] : null, getPerfEndYear, {
    revalidateOnMount: true,
  });
  return {
    perfEndYear: data,
    isPerfEndYearLoading: !error && !data,
    isPerfEndYearError: error,
  };
};

export default usePerfEndYear;
