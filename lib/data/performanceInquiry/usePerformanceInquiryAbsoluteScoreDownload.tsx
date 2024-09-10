import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import axios from '../../axios';
import qs from 'qs';

const API_PERFORMANCE_INQUIRY_DOWNLOAD =
  '/api/performance-inquiry/absolute-score-input/download';

const API_STOP_ABSOLUTE_INPUT_SCORE = '/api/performance-inquiry/stop';

export const getPerformanceInquiryDownload = (perfEmployeeIds: string[]) => {
  return axios
    .post(API_PERFORMANCE_INQUIRY_DOWNLOAD, perfEmployeeIds)
    .then((resp: AxiosResponse) => {
      toast.success(resp.data || 'Success generate download file!');
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Absolute Score Input file',
      );
    });
};

export const getPerformanceInquiryDownloadAll = (filter: any) => {
  const qsp = qs.stringify({ filter }, { skipNulls: true });
  return axios
    .get(`${API_PERFORMANCE_INQUIRY_DOWNLOAD}/all?${qsp}`)
    .then((resp: AxiosResponse) => {
      toast.success(resp.data || 'Success generate download file!');
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when downloading Absolute Score Input file',
      );
    });
};

// function stop absolute score download
export const stopDownloadInputAbsoluteScore = (id: string) => {
  return axios
    .post(`${API_STOP_ABSOLUTE_INPUT_SCORE}/${id}`)
    .then((resp: AxiosResponse) => {
      toast.success(resp.data || 'Success stop download file!');
    })
    .catch((e) => {
      toast.error(
        e.response.data.message ||
          'Error when stop download Absolute Score Input file',
      );
    });
};
