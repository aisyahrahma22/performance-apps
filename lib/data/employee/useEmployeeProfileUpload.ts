import axios from '../../axios';
import { forEach } from 'lodash';

const API_EMPLOYEE_PROFILE_UPLOAD = '/api/employee/profile/upload';

export const postEmployeeProfileUpload = (
  files: any,
  onUploadProgress: any,
  extraBody: any,
) => {
  const formData = new FormData();
  if (files.length > 1) {
    forEach(files, (file) => {
      formData.append('file', file);
    });
  } else {
    formData.append('file', files[0]);
  }
  if (extraBody) {
    forEach(extraBody, (body) => {
      formData.append('id', body);
    });
  }
  return axios
    .post(API_EMPLOYEE_PROFILE_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
