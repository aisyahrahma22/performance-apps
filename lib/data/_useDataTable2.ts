import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { get, isEmpty, isEqual, set, uniq, unset } from 'lodash';
import { toast } from 'react-toastify';
import useFetch from './_useFetch';

interface DataTableInput {
  api: string;
  fetcher?: any;
  defaultPage?: number;
  defaultPerPage?: number;
  // datatable actions
  fetcherDelete?: any;
  fetcherVerification?: any;
  fetcherVerificationAll?: any;
  onDeleteSuccess?: any;
  onDeleteError?: any;
  onVerificationSuccess?: any;
  onVerificationError?: any;
  defaultSort?: any;
  defaultFilter?: any;
}

const useDataTable2: any = ({
  api,
  fetcher,
  fetcherDelete,
  fetcherVerification,
  fetcherVerificationAll,
  defaultPage = 1,
  defaultPerPage = 10,
  onDeleteSuccess,
  onDeleteError,
  onVerificationSuccess,
  onVerificationError,
  defaultSort = {},
  defaultFilter = {},
}: DataTableInput) => {
  const [localData, setLocalData] = useState<any>();
  const [selectedLocalData, setSelectedLocalData] = useState<any[]>([]);
  const [page, setPage] = useState(defaultPage);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [sort, setSort] = useState<any>(defaultSort);
  const [filter, setFilter] = useState(defaultFilter);
  const [withDeleted, setWithDeleted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { data, error, mutate, isValidating } = useSWR(
    [api, filter, sort, page, perPage, withDeleted],
    fetcher,
  );
  const isSyncWithLocalData = isEqual(data?.data, localData);

  const updateSelectAllStatus = (data: any, selected: string[]) => {
    if (data && data?.every((val: any) => selected.includes(val.id))) {
      setIsSelectedAll(true);
    } else {
      setIsSelectedAll(false);
    }
  };

  if (data?.data && !error && !isSyncWithLocalData) {
    setLocalData(data?.data);
    updateSelectAllStatus(data?.data, selected);
  }

  useEffect(() => {
    if (data?.data?.length == 0 && data?.totalCount > 0) {
      setPage(1);
    }
  }, [data]);

  // sort pressers
  const sortPress = useCallback(
    (key) => () => {
      setSort((currentSort: any) => {
        const newSort = { ...currentSort };
        const currentValue = get(currentSort, key);
        if (currentValue === 'ASC') set(newSort, key, 'DESC');
        else if (!currentValue) set(newSort, key, 'ASC');
        else unset(newSort, key);
        setSelected([]);
        return newSort;
      });
    },
    [],
  );

  // paging pressers
  const pagePress = useCallback((_e, { activePage }) => {
    setPage(activePage);
  }, []);
  const perPagePress = useCallback((count: number) => {
    setPerPage(count);
  }, []);
  const refreshPress = useCallback(() => {
    mutate();
    setIsSelectedAll(false);
    setSelected([]);
  }, [mutate]);
  const nextPress = useCallback((activePage: number) => {
    setPage(activePage + 1);
  }, []);
  const prevPress = useCallback((activePage: number) => {
    if (activePage > 1) {
      setPage(activePage - 1);
    }
  }, []);

  // selection pressers
  const selectAllPress = useCallback(
    (val?) => {
      if (!data?.data || error) return;
      if (isSelectedAll) {
        setSelected((prev) =>
          prev.filter(
            (id) =>
              !data?.data?.find((currData: any) => currData.id === id)?.id,
          ),
        );
        setSelectedLocalData((prev) =>
          prev.filter(
            (prevData: any) =>
              !data?.data?.find(
                (currData: any) => currData?.id === prevData.id,
              ),
          ),
        );
        setIsSelectedAll((p) => !p);
      } else {
        setSelected((prev) =>
          uniq([...prev, ...data?.data.map((d: any) => d.id)]),
        );
        setSelectedLocalData((prev) =>
          uniq([...prev, ...data?.data.map((d: any) => d)]),
        );
        setIsSelectedAll((p) => val ?? !p);
      }
    },
    [data?.data, error, isSelectedAll],
  );
  const selectOnePress = useCallback(
    (id) => {
      if (!data?.data || error) return;
      // bunch of condition and selection
      const selectedData = data?.data.find((data: any) => data?.id === id);
      const isInSelected = selected.includes(id);
      const isInSelectedData = selectedLocalData.some(
        (data: any) => data?.id === id,
      );

      // if exist in selected and selectedLocalData (means it is removing process), remove selected id from the corresponding state
      if (isInSelected && isInSelectedData) {
        setSelected((prev) => {
          const localData = prev.filter((selectedId) => selectedId != id);
          updateSelectAllStatus(data?.data, localData);
          return localData;
        });
        setSelectedLocalData((prev) =>
          prev.filter((selectedObj) => selectedObj.id != id),
        );
      }

      // if not exist in selected and selectedLocalData (means it is adding process), add selected id to the corresponding state
      if (!isInSelected && !isInSelectedData) {
        setSelected((prev) => {
          const localData = [...prev, id];
          updateSelectAllStatus(data?.data, localData);
          return localData;
        });
        setSelectedLocalData((prev) => [...prev, selectedData]);
      }
    },
    [data?.data, error, selected, selectedLocalData],
  );

  // delete fetchers
  const {
    data: dataDelete,
    error: errorDelete,
    isLoading: deleteIsValidating,
    fetch: deleteMutate,
  } = useFetch({
    fetcher: fetcherDelete,
  });

  // delete pressers
  const deletePress = useCallback(
    (ids: string[] | any) => {
      setIsSelectedAll(false);
      setSelected([]);
      deleteMutate(ids);
    },
    [deleteMutate],
  );

  // delete effects
  useEffect(() => {
    if (dataDelete) {
      setSelected([]);
      if (onDeleteSuccess) onDeleteSuccess?.(dataDelete);
      else toast.success('Data has been deleted');
      mutate();
    }
  }, [dataDelete, mutate, onDeleteSuccess]);
  useEffect(() => {
    if (errorDelete) {
      if (onDeleteError) onDeleteError?.(errorDelete);
      else toast.error('Error when deleting');
    }
  }, [errorDelete, onDeleteError]);

  // verification fetchers
  const {
    data: dataVerification,
    error: errorVerification,
    isLoading: verificationIsValidating,
    fetch: verificationMutate,
  } = useFetch({
    fetcher: fetcherVerification,
  });
  const {
    data: dataVerificationAll,
    error: errorVerificationAll,
    isLoading: verificationAllIsValidating,
    fetch: verificationAllMutate,
  } = useFetch({
    fetcher: fetcherVerificationAll,
  });

  // verification pressers
  const verificationPress = useCallback(
    (ids: string[]) => {
      if (isSelectedAll) {
        if (fetcherVerificationAll) verificationAllMutate(filter);
      } else if (ids.length > 0) {
        if (fetcherVerification) verificationMutate(ids);
      }
    },
    [
      isSelectedAll,
      verificationAllMutate,
      verificationMutate,
      fetcherVerification,
      fetcherVerificationAll,
      filter,
    ],
  );

  // verification effects
  useEffect(() => {
    if (dataVerification) {
      setSelected([]);
      if (onVerificationSuccess) onVerificationSuccess?.(dataVerification);
      else toast.success('Data has been verified');
      mutate();
    }
  }, [dataVerification, mutate, onVerificationSuccess]);

  useEffect(() => {
    if (errorVerification) {
      if (onVerificationError) onVerificationError?.(errorVerification);
      else toast.error('Error when verifying');
    }
  }, [errorVerification, onVerificationError]);

  // verification all effects
  useEffect(() => {
    if (dataVerificationAll) {
      setSelected([]);
      setIsSelectedAll(false);
      if (onVerificationSuccess) onVerificationSuccess?.(dataVerificationAll);
      else toast.success('All Data has been verified');
      mutate();
    }
  }, [dataVerificationAll, mutate, onVerificationSuccess]);

  useEffect(() => {
    if (errorVerificationAll) {
      if (onVerificationError) onVerificationError?.(errorVerificationAll);
      else toast.error('Error when verifying all data');
    }
  }, [errorVerificationAll, onVerificationError]);

  return {
    data: data?.data,
    isDataEmpty: isEmpty(data?.data),
    isDataLoading:
      (!error && !data?.data) ||
      isValidating ||
      deleteIsValidating ||
      verificationIsValidating ||
      verificationAllIsValidating,
    isDataError: error,
    dataTotalCount: data?.totalCount,
    dataTotalPage: data?.totalPage,
    page,
    perPage,
    withDeleted,
    refreshPress,
    pagePress,
    perPagePress,
    nextPress,
    prevPress,
    sort,
    setSort,
    sortPress,
    filter,
    setFilter,
    setPage,
    setPerPage,
    setWithDeleted,
    selectAllPress,
    selectOnePress,
    selected,
    selectedLocalData,
    isSelectedAll,
    deletePress,
    verificationPress,
    isDeleteLoading: !errorDelete && !dataDelete,
    isVerificationLoading:
      !errorVerification &&
      !dataVerification &&
      !dataVerificationAll &&
      !errorVerificationAll,
  };
};

export default useDataTable2;
