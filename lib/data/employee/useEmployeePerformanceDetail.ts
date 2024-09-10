import axios from '../../axios';
import useSWR from 'swr';

const API_EMPLOYEE_PERFORMANCE_DETAIL = '/api/emp-performance/detail';

const getEmployeePerformanceDetail = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useEmployeePerformanceDetail = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_EMPLOYEE_PERFORMANCE_DETAIL, id] : null,
    getEmployeePerformanceDetail,
    {
      revalidateOnMount: true,
    },
  );
  return {
    empPerformanceDetail: data,
    isEmpPerformanceDetailLoading: !error && !data,
    isEmpPerformanceDetailError: error,
  };
};

export default useEmployeePerformanceDetail;
