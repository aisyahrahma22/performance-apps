import { useCallback, useState } from 'react';

interface UseFetch {
  fetcher: any;
  onSuccess?: any;
  onError?: any;
  onFinally?: any;
}

const useFetch = ({ fetcher, onSuccess, onError, onFinally }: UseFetch) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [message, setMassage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetch = useCallback(
    async (...values) => {
      setIsLoading(true);
      setData(null);
      setError(null);
      fetcher(...values)
        .then((data: any) => {
          onSuccess?.(data);
          setData(data);
          setIsLoading(false);
        })
        .catch((e: any) => {
          setMassage(e.response?.data?.message);
          onError?.(e);
          setError(e);
          setIsLoading(false);
        })
        .finally(onFinally);
    },
    [fetcher, onSuccess, onError, onFinally],
  );

  return {
    data,
    error,
    fetch,
    isLoading,
    message,
  };
};

export default useFetch;
