import axios from '../../axios';
import useSWR from 'swr';

const API_DATA_ACCESS_MAPPING = '/api/DataAccessMapping';

const getDataAccessMapping = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useDataAccessMapping = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_DATA_ACCESS_MAPPING, id] : null,
    getDataAccessMapping,
    {
      revalidateOnMount: true,
    },
  );
  return {
    dataAccessMapping: data,
    isDataAccessMappingLoading: !error && !data,
    isDataAccessMappingError: error,
  };
};

export default useDataAccessMapping;
