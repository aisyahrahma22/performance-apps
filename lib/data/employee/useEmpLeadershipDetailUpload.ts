import axios from '../../axios';
import { forEach } from 'lodash';

const API_EMP_LA_UPLOAD_DETAIL = '/api/emp-leadership-assessment/detail/upload';

export const postEmpLeadershipDetailUpload = (
  files: any,
  onUploadProgress: any,
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
    .post(API_EMP_LA_UPLOAD_DETAIL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
