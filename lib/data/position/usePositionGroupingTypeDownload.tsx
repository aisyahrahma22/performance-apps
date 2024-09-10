import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_POSITION_GROUPING_TYPE_DOWNLOAD =
  '/api/position/grouping-type/download';

export const getPositionGroupingTypeDownload = () => {
  return axios
    .get(API_POSITION_GROUPING_TYPE_DOWNLOAD, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Position Grouping Type Format file',
      );
    });
};
