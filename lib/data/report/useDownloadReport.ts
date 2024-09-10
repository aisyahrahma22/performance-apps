import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_REPORT = '/api/report/download';

export const getDownloadReport = (id: string) => {
  document.body.style.cursor = 'progress';
  return toast.promise(
    new Promise<void>((resolve, reject) =>
      axios
        .get(`${API_REPORT}/${id}`, { responseType: 'blob' })
        .then((resp: AxiosResponse) => {
          document.body.style.cursor = 'auto';
          fileDownload(resp.data, getFilenameFromHeader(resp));
          resolve();
        })
        .catch((e) => {
          document.body.style.cursor = 'auto';
          reject(e.response.data.message);
        }),
    ),
    {
      pending: {
        render() {
          return 'File is downloading, please wait.';
        },
        icon: true,
      },
      success: {
        render() {
          return 'Success download file';
        },
        icon: true,
      },
      error: {
        render({ data }) {
          return data || 'Failed download file';
        },
        icon: true,
      },
    },
  );
};
