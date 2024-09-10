import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PATCH_MAIL = '/api/mail/template';

const patchMailTemplate = (values: any) => {
  return axios.patch(API_PATCH_MAIL, values).then((resp) => resp.data);
};

interface MailTemplateEdit {
  onSuccess?: any;
}

const useMailTemplateEdit = (args: MailTemplateEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data.code} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchMailTemplate,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    mailTemplateEdit: fetch,
    isMailTemplateEditLoading: isLoading,
  };
};

export default useMailTemplateEdit;
