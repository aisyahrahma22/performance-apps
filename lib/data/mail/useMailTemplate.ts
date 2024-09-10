import axios from '../../axios';
import useSWR from 'swr';

const API_MAIL_TEMPLATE = '/api/mail/template';

const getMailTemplate = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useMailTemplate = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_MAIL_TEMPLATE, id] : null,
    getMailTemplate,
    {
      revalidateOnMount: true,
    },
  );

  return {
    mailTemplate: data,
    isMailTemplateLoading: !error && !data,
    isMailTemplateError: error,
  };
};

export default useMailTemplate;
