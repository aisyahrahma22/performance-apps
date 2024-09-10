import axios from '../../axios';
import useSWR from 'swr';

const API_FLIGHT_RISK = '/api/talent-review-meeting/flight-risk-dashboard';

const getFlightRiskUser = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useFlightRiskUser = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_FLIGHT_RISK, id] : null,
    getFlightRiskUser,
    {
      revalidateOnMount: true,
    },
  );

  return {
    flightRiskUser: data,
    isflightRiskUserLoading: !error && !data,
    isflightRiskUserError: error,
  };
};

export default useFlightRiskUser;
