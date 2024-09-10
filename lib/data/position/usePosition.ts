import axios from '../../axios';
import useSWR from 'swr';

const API_POSITION = '/api/position';

const getPosition = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePosition = (id: string) => {
  const { data, error } = useSWR(id ? [API_POSITION, id] : null, getPosition, {
    revalidateOnMount: true,
  });
  return {
    position: data,
    isPositionLoading: !error && !data,
    isPositionError: error,
  };
};

export default usePosition;
