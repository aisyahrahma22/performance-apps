import { convert } from 'html-to-text';

const renderHtmlToText = (htmlString?: string) => {
  const options = {
    wordwrap: 80,
    limits: { maxDepth: 3 },
  };
  if (!htmlString) return '—';
  return convert(htmlString, options);
};

export default renderHtmlToText;
