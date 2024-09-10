import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_PERFORMANCE_MEASUREMENT_DETAIL_DOWNLOAD =
  '/api/performance-measurement/detailFileFinal';

export const getFilePerformanceMeasurementFinalDetail = () => {
  return axios
    .get(API_PERFORMANCE_MEASUREMENT_DETAIL_DOWNLOAD, {
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
