import useSWR from 'swr';
import axios from '../../axios';

const API_DDG_WORKLOCATION = '/api/ddg/worklocation';
const getCurrentDDGWorklocations = (url: string) => {
  return axios.get(url).then((resp) => resp.data);
};

const useDDGWorklocations = () => {
  const { data, error } = useSWR(
    [API_DDG_WORKLOCATION],
    getCurrentDDGWorklocations,
    {
      revalidateOnMount: true,
    },
  );
  return {
    worklocation: data,
    isDDGWorklocationsLoading: !error && !data,
    isDDGWorklocationsError: error,
  };
};

export default useDDGWorklocations;
