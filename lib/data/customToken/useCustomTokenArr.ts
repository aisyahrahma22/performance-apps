import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_CUSTOM_TOKEN = '/api/custom-token/token';

export const getCustomToken = async () => {
  return await axios.get(API_CUSTOM_TOKEN).then((resp) => resp.data);
};

const useCustomTokenArr = () => {
  const { data, isDataLoading } = useDataTable({
    api: API_CUSTOM_TOKEN,
    fetcher: getCustomToken,
  });

  return {
    customTokenArr: data,
    isCustomTokenArrLoading: isDataLoading,
  };
};

export default useCustomTokenArr;
