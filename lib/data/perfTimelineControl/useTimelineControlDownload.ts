import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

export const getTimelineControlDownload = (api: string, id: string) => {
  return axios
    .get(`${api}/${id}`, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      if (e.response.status == '404') {
        toast.success(
          'No error log to be downloaded. All records updated successfully',
        );
      } else {
        toast.error(e.response.data.message || 'Error when downloading file');
      }
    });
};
