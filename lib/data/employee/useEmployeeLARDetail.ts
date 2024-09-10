import axios from '../../axios';
import useSWR from 'swr';

const API_EMPLOYEE_LARD_DETAIL = '/api/emp-leadership-assessment/detail';

const getEmployeeLARDetail = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useEmployeeLARDetail = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_EMPLOYEE_LARD_DETAIL, id] : null,
    getEmployeeLARDetail,
    {
      revalidateOnMount: true,
    },
  );

  return {
    empLARDetail: data,
    isEmpLARDetailLoading: !error && !data,
    isEmpLARDetailError: error,
  };
};

export default useEmployeeLARDetail;
