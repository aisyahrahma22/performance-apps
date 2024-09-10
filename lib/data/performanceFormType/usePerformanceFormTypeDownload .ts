import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCE_FORM_TYPE_DOWNLOAD =
  '/api/performance-measurement/download';

export const getFilePerformanceForm = () => {
  return axios
    .get(API_PERFORMANCE_FORM_TYPE_DOWNLOAD, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Performance Form Type file',
      );
    });
};
