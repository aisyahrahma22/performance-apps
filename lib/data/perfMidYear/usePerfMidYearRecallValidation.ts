import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_MID_YEAR = '/api/perf-mid-year/recall-validation';
const API_PERF_END_YEAR = '/api/perf-end-year/recall-validation';

const getPerfEmpRecallValidation = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfEmpRecallValidation = (
  id: string,
  isApproval = false,
  isEndYear: boolean,
) => {
  const url = isApproval
    ? `${isEndYear ? API_PERF_END_YEAR : API_PERF_MID_YEAR}/approval`
    : isEndYear
    ? API_PERF_END_YEAR
    : API_PERF_MID_YEAR;

  const { data, error } = useSWR(
    id ? [url, id] : null,
    getPerfEmpRecallValidation,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfEmpRecallValidation: data,
    isPerfEmpRecallValidationLoading: !error && !data,
    isPerfEmpRecallValidationError: error,
  };
};

export default usePerfEmpRecallValidation;
