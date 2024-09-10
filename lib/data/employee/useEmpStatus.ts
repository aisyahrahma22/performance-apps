import axios from '../../axios';

const API_EMP_STATUS = '/api/employee/status';

export const getEmpStatus = (url: string = API_EMP_STATUS) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};
