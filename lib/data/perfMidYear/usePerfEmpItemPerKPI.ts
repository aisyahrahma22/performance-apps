import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_MID_YEAR_KPI_ITEM = '/api/perf-mid-year/kpi-items';

const getPerfEmpItemPerKPI = (url: string, ids: string) => {
  return axios.get(url, { params: { ids } }).then((resp) => resp.data);
};

const usePerfEmpItemPerKPI = (ids: string) => {
  const { data, error } = useSWR(
    ids ? [API_PERF_MID_YEAR_KPI_ITEM, ids] : null,
    getPerfEmpItemPerKPI,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfEmpItemPerKPI: data,
    isPerfEmpItemPerKPILoading: !error && !data,
    isPerfEmpItemPerKPIError: error,
  };
};

export default usePerfEmpItemPerKPI;
