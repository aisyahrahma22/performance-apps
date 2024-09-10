import axios from '../../axios';
import useSWR from 'swr';

const API_EMPLOYEE_PERFORMANCE_DETAIL = '/api/home';

const getHomeDataCount = (url: string) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};

const useHomeDataCount = () => {
  const { data, error } = useSWR(
    API_EMPLOYEE_PERFORMANCE_DETAIL,
    getHomeDataCount,
    {
      revalidateOnMount: true,
    },
  );
  return {
    homeDataCount: data,
    isHomeLoading: !error && !data,
    isHomeError: error,
  };
};

export default useHomeDataCount;
