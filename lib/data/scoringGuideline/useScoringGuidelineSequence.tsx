import axios from '../../axios';
import useSWR from 'swr';

const API_SCORING_GUIDELINE_SEQUENCE = '/api/scoring-guideline/sequence';

export const getScoringGuidelineSequence = (url: string) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};

const useScoringGuidelineSequence = () => {
  const { data, error } = useSWR(
    [API_SCORING_GUIDELINE_SEQUENCE],
    getScoringGuidelineSequence,
    {
      revalidateOnMount: true,
    },
  );
  return {
    scoringGuidelineSequence: data,
    isScoringGuidelineSequenceLoading: !error && !data,
    isScoringGuidelineSequenceError: error,
  };
};

export default useScoringGuidelineSequence;
