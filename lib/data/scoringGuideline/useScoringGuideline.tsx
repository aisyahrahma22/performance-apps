import axios from '../../axios';
import useSWR from 'swr';

const API_SCORING_GUIDELINE = '/api/scoring-guideline';

export const getScoringGuideline = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useScoringGuideline = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_SCORING_GUIDELINE, id] : null,
    getScoringGuideline,
    {
      revalidateOnMount: true,
    },
  );
  return {
    scoringGuideline: data,
    isScoringGuidelineLoading: !error && !data,
    isScoringGuidelineError: error,
  };
};

export default useScoringGuideline;
