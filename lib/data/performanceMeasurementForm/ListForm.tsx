import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_LIST_DATA = '/api/peformance-measurement/listForm';

export const getListForm = () => {
  return axios.get(`${API_LIST_DATA}`).then((resp) => resp.data);
};

const useListForm = () => {
  const { data } = useDataTable({
    api: API_LIST_DATA,
    fetcher: getListForm,
  });

  return {
    ListForm: data,
  };
};

export default useListForm;
