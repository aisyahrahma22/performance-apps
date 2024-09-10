import axios from '../../axios';

const API_PERFORMANCE_INQUIRY_UPLOAD =
  '/api/performance-inquiry/absolute-score-input/upload';

export const postPerformanceInquiryAbsoluteScoreUpload = (
  files: any,
  onUploadProgress: any,
) => {
  const formData = new FormData();

  if (files.length > 1) {
    files.forEach((file: any) => {
      formData.append('file', file);
    });
  } else {
    formData.append('file', files[0]);
  }

  return axios.post(API_PERFORMANCE_INQUIRY_UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};
