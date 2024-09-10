import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { get, includes, isEmpty, remove, set, unset } from 'lodash';
import { toast } from 'react-toastify';
import useFetch from './_useFetch';

interface DataTableInput {
  api: string;
  fetcher?: any;
  defaultPage?: number;
  defaultPerPage?: number;
  // datatable actions
  fetcherDelete?: any;
  fetcherDeleteAll?: any;
  fetcherVerification?: any;
  fetcherVerificationAll?: any;
  onDeleteSuccess?: any;
  onDeleteError?: any;
  onVerificationSuccess?: any;
  onVerificationError?: any;
  defaultSort?: any;
  defaultFilter?: any;
}

const useDataTable: any = ({
  api,
  fetcher,
  fetcherDelete,
  fetcherDeleteAll,
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
  const [page, setPage] = useState(defaultPage);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [sort, setSort] = useState<any>(defaultSort);
  const [filter, setFilter] = useState(defaultFilter);
  const [withDeleted, setWithDeleted] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { data, error, mutate, isValidating } = useSWR(
    [api, filter, sort, page, perPage, withDeleted],
    fetcher,
  );

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
    setSelected([]);
  }, []);
  const perPagePress = useCallback((count: number) => {
    setPerPage(count);
    setSelected([]);
  }, []);
  const refreshPress = useCallback(() => {
    mutate();
    setIsSelectedAll(false);
    setSelected([]);
  }, [mutate]);
  const nextPress = useCallback((activePage: number) => {
    setPage(activePage + 1);
    setSelected([]);
  }, []);
  const prevPress = useCallback((activePage: number) => {
    if (activePage > 1) setPage(activePage - 1);
    setSelected([]);
  }, []);
  const firstPagePress = useCallback((countPage: number) => {
    setPage(countPage / countPage);
    setSelected([]);
  }, []);
  const lastPagePress = useCallback((countPage: number) => {
    setPage(countPage);
    setSelected([]);
  }, []);
  const nextFivePagePress = useCallback((page: any) => {
    if (page?.totalPage - page?.activePage <= 5) {
      setPage(page?.totalPage);
      setSelected([]);
    } else {
      setPage(page?.activePage + 5);
      setSelected([]);
    }
  }, []);
  const prevFivePagePress = useCallback((activePage: number) => {
    if (activePage <= 5) {
      if (activePage > 1) setPage(1);
      setSelected([]);
    } else {
      if (activePage > 1) setPage(activePage - 5);
      setSelected([]);
    }
  }, []);
  // selection pressers
  const selectAllPress = useCallback(
    (val?) => () => {
      setSelected([]);
      setIsSelectedAll((p) => val ?? !p);
    },
    [],
  );

  const selectOnePress = useCallback(
    (id) => () => {
      if (isSelectedAll) {
        setSelected(
          data?.data.filter((d: any) => d.id !== id).map((d: any) => d.id),
        );
        setIsSelectedAll(false);
      } else {
        setSelected((data: any) => {
          const newData: any = [...data];
          if (includes(newData, id)) remove(newData, (n) => n === id);
          else newData.push(id);
          return newData;
        });
      }
    },
    [isSelectedAll, data?.data],
  );

  // selection effects
  useEffect(() => {
    if (selected?.length === data?.totalCount && data?.totalCount !== 0)
      setIsSelectedAll(true);
  }, [selected, data?.totalCount]);
  useEffect(() => {
    selectAllPress(false)();
  }, [filter, selectAllPress]);

  // delete fetchers
  const {
    data: dataDelete,
    error: errorDelete,
    isLoading: deleteIsValidating,
    message: deleteMassage,
    fetch: deleteMutate,
  } = useFetch({
    fetcher: fetcherDelete,
  });
  const {
    data: dataDeleteAll,
    error: errorDeleteAll,
    isLoading: deleteAllIsValidating,
    message: deleteAllMassage,
    fetch: deleteAllMutate,
  } = useFetch({
    fetcher: fetcherDeleteAll,
  });

  // delete pressers
  const deletePress = useCallback(
    (ids: string[] | any) => {
      if (isSelectedAll) {
        if (fetcherDeleteAll) deleteAllMutate(ids);
      } else if (ids.length > 0) {
        if (fetcherDelete) deleteMutate(ids);
      }
    },
    [
      isSelectedAll,
      deleteMutate,
      deleteAllMutate,
      fetcherDelete,
      fetcherDeleteAll,
    ],
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
      else
        toast.error(deleteMassage || 'Error when deleting', {
          icon: true,
        });
    }
  }, [deleteMassage, errorDelete, onDeleteError]);

  // delete all effects
  useEffect(() => {
    if (dataDeleteAll) {
      setSelected([]);
      setIsSelectedAll(false);
      if (onDeleteSuccess) onDeleteSuccess?.(dataDeleteAll);
      else toast.success('All Data has been deleted');
      mutate();
    }
  }, [dataDeleteAll, deleteMassage, mutate, onDeleteSuccess]);

  useEffect(() => {
    if (errorDeleteAll) {
      if (onDeleteError) onDeleteError?.(errorDeleteAll);
      else
        toast.error(deleteAllMassage || 'Error when deleting all data', {
          icon: true,
        });
    }
  }, [deleteAllMassage, deleteMassage, errorDeleteAll, onDeleteError]);

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
      deleteAllIsValidating ||
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
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
    isSelectedAll,
    deletePress,
    verificationPress,
    isDeleteLoading:
      !errorDelete && !dataDelete && !dataDeleteAll && !errorDeleteAll,
    isVerificationLoading:
      !errorVerification &&
      !dataVerification &&
      !dataVerificationAll &&
      !errorVerificationAll,
  };
};

export default useDataTable;
