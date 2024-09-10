import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_EMP_PERFORMANCE_DOWNLOAD = '/api/emp-performance/download';

export const getEmpPerfDownload = () => {
  return axios
    .get(API_EMP_PERFORMANCE_DOWNLOAD, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Training Format file',
      );
    });
};
