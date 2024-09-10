import axios from '../../axios';
import useSWR from 'swr';

const API_HUMAN_ASSET_VALUE =
  '/api/talent-review-meeting/human-asset-value-dashboard';

const getHumanAssetValueUser = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useHumanAssetValueUser = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_HUMAN_ASSET_VALUE, id] : null,
    getHumanAssetValueUser,
    {
      revalidateOnMount: true,
    },
  );

  return {
    humanAssetValueUser: data,
    ishumanAssetValueUserLoading: !error && !data,
    ishumanAssetValueUserError: error,
  };
};

export default useHumanAssetValueUser;
