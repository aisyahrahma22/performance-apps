import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCE_TIMELINES_DOWNLOAD =
  '/api/performance-form/timeline/download';

export const getTimelineDownload = () => {
  return axios
    .get(API_PERFORMANCE_TIMELINES_DOWNLOAD, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message || 'Error when downloading Program Format file',
      );
    });
};
