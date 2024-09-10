import { replace } from 'lodash';

export const escapeHtmlString = (htmlStr: any) => {
  if (!htmlStr) return '—';
  return replace(htmlStr, /(<([^>]+)>)/gi, '');
};
