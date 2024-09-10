import axios from '../../axios';
import { forEach } from 'lodash';

const API_POSITION_GROUPING_UPLOAD = '/api/position/grouping/upload';

export const postPositionGroupingUpload = (
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
    .post(API_POSITION_GROUPING_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
