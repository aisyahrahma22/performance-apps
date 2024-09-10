import axios from '../../axios';
import { forEach } from 'lodash';

const API_TIMELINE_UPLOAD = '/api/performance-form/timeline/upload';

export const postTimelineUpload = (files: any, onUploadProgress: any) => {
  const formData = new FormData();
  if (files.length > 1) {
    forEach(files, (file) => {
      formData.append('file', file);
    });
  } else {
    formData.append('file', files[0]);
  }
  return axios
    .post(API_TIMELINE_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
