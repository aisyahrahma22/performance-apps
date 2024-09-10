import { AxiosResponse } from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';
import axios from '../../axios';

const API_SYNC_FORM_TO_DDG = '/api/performance-form/sync-form-to-ddg';

export const doSyncFormToDDG = (perfFormIds: string[]) => {
  return axios
    .post(API_SYNC_FORM_TO_DDG, perfFormIds)
    .then((resp: AxiosResponse) => {
      toast.success(resp.data || 'Form is being sync!');
    })
    .catch((e) => {
      toast.error(e.response.data.message || 'Error when sync form');
    });
};

export const doSyncAllFormToDDG = (slicer: any) => {
  const qsp = qs.stringify({ slicer }, { skipNulls: true });
  return axios
    .get(`${API_SYNC_FORM_TO_DDG}/all?${qsp}`)
    .then((resp: AxiosResponse) => {
      toast.success(resp.data || 'Form is being sync!');
    })
    .catch((e) => {
      toast.error(e.response.data.message || 'Error when sync form');
    });
};
