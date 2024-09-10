import axios from '../../axios';
import { forEach } from 'lodash';

const API_PERFORMANCECATEGORY_UPLOAD = '/api/category/upload';

export const postPerformanceCategoryUpload = (
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
    .post(API_PERFORMANCECATEGORY_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
