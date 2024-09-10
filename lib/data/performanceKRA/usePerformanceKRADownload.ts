import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCEKRA_DOWNLOAD = '/api/performancekra/download';

export const getPerformanceKRADownload = () => {
  return axios
    .get(API_PERFORMANCEKRA_DOWNLOAD, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message || 'Error when downloading KRA Format file',
      );
    });
};
