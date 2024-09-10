import useSWR from 'swr';
import axios from '../../axios';

const API_DDG_WORKLOCATION = '/api/employee/worklocation';
const getWorklocations = (url: string) => {
  return axios.get(url).then((resp) => resp.data);
};

const useWorklocationsByHopeId = () => {
  const { data, error } = useSWR([API_DDG_WORKLOCATION], getWorklocations, {
    revalidateOnMount: true,
  });
  return {
    worklocations: data,
    isWorklocationsLoading: !error && !data,
    isWorklocationsError: error,
  };
};

export default useWorklocationsByHopeId;
