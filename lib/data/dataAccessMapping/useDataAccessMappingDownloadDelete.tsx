import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_DATA_ACCESS_MAPPING_DOWNLOAD_DELETE =
  '/api/DataAccessMapping/file-delete';

export const getDataAccessMappingDownloadDelete = () => {
  return axios
    .get(API_DATA_ACCESS_MAPPING_DOWNLOAD_DELETE, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Data Access Mapping Delete Format file',
      );
    });
};
