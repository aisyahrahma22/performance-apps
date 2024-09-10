import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_DOWNLOAD_UPLOAD_HISTORY =
  '/api/upload-progress/download-history-upload';

export const getDownloadUploadHistory = (id: string) => {
  document.body.style.cursor = 'progress';
  return toast.promise(
    new Promise<void>((resolve, reject) =>
      axios
        .get(`${API_DOWNLOAD_UPLOAD_HISTORY}/${id}`, { responseType: 'blob' })
        .then((resp: AxiosResponse) => {
          document.body.style.cursor = 'auto';
          fileDownload(resp?.data, getFilenameFromHeader(resp));
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
