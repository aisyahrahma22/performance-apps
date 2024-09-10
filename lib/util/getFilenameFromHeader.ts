import { AxiosResponse } from 'axios';

const getFilenameFromHeader = (resp: AxiosResponse) => {
  let filename = '';
  const disposition = resp.headers['content-disposition'] || '';
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  return filename || 'DEFAULT_FILENAME';
};

export default getFilenameFromHeader;
