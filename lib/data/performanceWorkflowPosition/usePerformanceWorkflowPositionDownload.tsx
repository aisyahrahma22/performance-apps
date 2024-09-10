import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCE_WORKFLOW_POSITION =
  '/api/performanceworkflow/position/download';

export const getPerformanceWorkflowPositionDownload = () => {
  return axios
    .get(API_PERFORMANCE_WORKFLOW_POSITION, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Performance Superior Workflow Position Format file',
      );
    });
};
