import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCETYPE_DOWNLOAD = '/api/performancetype/download';

export const getPerformanceTypeDownload = () => {
  return axios
    .get(API_PERFORMANCETYPE_DOWNLOAD, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Performance Format file',
      );
    });
};
