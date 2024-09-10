import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCECATEGORY = '/api/category';

export const getCategory = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceCategory = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCECATEGORY, id] : null,
    getCategory,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceCategory: data,
    isPerformanceCategoryLoading: !error && !data,
    isPerformanceCategoryError: error,
  };
};

export default usePerformanceCategory;
