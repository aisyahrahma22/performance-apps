import axios from '../../axios';
import useSWR from 'swr';

const API_CHECK_DATA_ACCESS_MAPPING = '/api/DataAccessMapping/check-access';
interface CheckHasAccessMapping {
  dataAccessMapping: boolean;
  isDataAccessMappingLoading: boolean;
  isDataAccessMappingError: any;
}

const getDataAccessMappingId = (url: string) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};

const useCheckHasAccessMapping = (): CheckHasAccessMapping => {
  const { data, error } = useSWR(
    API_CHECK_DATA_ACCESS_MAPPING,
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

export default useCheckHasAccessMapping;
