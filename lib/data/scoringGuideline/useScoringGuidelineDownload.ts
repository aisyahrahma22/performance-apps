import axios from '../../axios';
import fileDownload from 'js-file-download';
import { AxiosResponse } from 'axios';
import getFilenameFromHeader from '../../util/getFilenameFromHeader';
import { toast } from 'react-toastify';

const API_SCORING_GUIDELINE_DOWNLOAD = '/api/scoring-guideline/file';

export const getScoringGuidelineDownload = (id: string) => {
  return axios
    .get(`${API_SCORING_GUIDELINE_DOWNLOAD}/${id}`, {
      responseType: 'blob',
    })
    .then((resp: AxiosResponse) => {
      fileDownload(resp.data, getFilenameFromHeader(resp));
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading scoring guideline file',
      );
    });
};
