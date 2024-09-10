import axios from '../../axios';
import useSWR from 'swr';

const API_AUTH_DATA_ACCESS_MAPPING = '/api/auth/data-access-mapping';

const getDataAccessMappingId = (url: string) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};

const useDataAccessMappingId = () => {
  const { data, error } = useSWR(
    API_AUTH_DATA_ACCESS_MAPPING,
    getDataAccessMappingId,
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

export default useDataAccessMappingId;
