import axios from '../../axios';
import useSWR from 'swr';

const API_BOX = '/api/boxes';

const getBox = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useBox = (id: string) => {
  const { data, error } = useSWR(id ? [API_BOX, id] : null, getBox, {
    revalidateOnMount: true,
  });
  return {
    box: data,
    isBoxLoading: !error && !data,
    isBoxError: error,
  };
};

export default useBox;
