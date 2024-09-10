import useSWR from 'swr';
import axios from '../../axios';
import { EncryptBase64 } from '../../util/base64Transform';

const API_CUSTOM_TOKEN = '/api/custom-token/token';

export const getCustomToken = async (url: string, token: string) => {
  const endcodeToken = EncryptBase64(token);
  return await axios.get(`${url}/${endcodeToken}`).then((resp) => resp.data);
};

const useCustomOneToken = (token: any) => {
  const { data, error } = useSWR(
    token ? [API_CUSTOM_TOKEN, token] : null,
    getCustomToken,
  );
  return {
    customToken: data?.data,
    isCustomTokenLoading: !error && !data,
    isCustomTokenError: error?.response?.data?.message,
  };
};

export default useCustomOneToken;
