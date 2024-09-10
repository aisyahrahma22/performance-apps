import axios from '../../axios';
import useSWR from 'swr';

const API_POSITION_LEVEL = '/api/position/level';

const getPositionLevel = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePositionLevel = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_POSITION_LEVEL, id] : null,
    getPositionLevel,
    {
      revalidateOnMount: true,
    },
  );
  return {
    positionLevel: data,
    isPositionLevelLoading: !error && !data,
    isPositionLevelError: error,
  };
};

export default usePositionLevel;
