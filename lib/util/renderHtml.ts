import parser from 'html-react-parser';

const renderHtml = (htmlString?: string) => {
  if (!htmlString) return '—';
  return parser(htmlString);
};

export default renderHtml;
