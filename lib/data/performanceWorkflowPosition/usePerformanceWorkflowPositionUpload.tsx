import axios from '../../axios';
import { forEach } from 'lodash';

const API_PERFORMANCE_WORKFLOW_POSITION =
  '/api/performanceworkflow/position/upload';

export const postPerformanceWorkflowPositionUpload = (
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
    .post(API_PERFORMANCE_WORKFLOW_POSITION, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((resp) => resp.data);
};
