import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCE_WORKFLOW_EMPLOYEE =
  '/api/performanceworkflow/employee/download';

export const getPerformanceWorkflowEmployeeDownload = () => {
  return axios
    .get(API_PERFORMANCE_WORKFLOW_EMPLOYEE, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Performance Superior Workflow Employee Format file',
      );
    });
};
