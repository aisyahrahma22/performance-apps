import axios from '../../axios';
import { forEach } from 'lodash';

const API_PERFORMANCE_FORM_UPLOAD = '/api/performance-form/upload/participant/';

export const postPerformanceFormParticipantUpload = (
  files: any,
  onUploadProgress: any,
  isChecked: boolean,
) => {
  const formData = new FormData();
  if (files.length > 1) {
    forEach(files, (file) => {
      formData.append('file', file);
    });
  } else {
    formData.append('file', files[0]);
  }
  return axios
    .post(API_PERFORMANCE_FORM_UPLOAD + isChecked, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
