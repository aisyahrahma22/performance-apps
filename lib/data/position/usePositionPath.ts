import axios from '../../axios';
import useSWR from 'swr';

const API_POSITION_PATH = '/api/position/Path';

const getPositionPath = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePositionPath = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_POSITION_PATH, id] : null,
    getPositionPath,
    {
      revalidateOnMount: true,
    },
  );
  return {
    positionPath: data,
    isPositionPathLoading: !error && !data,
    isPositionPathError: error,
  };
};

export default usePositionPath;
