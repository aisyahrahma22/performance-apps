import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_SCORING_GUIDELINE = '/api/scoring-guideline';
const API_DELETE_ALL_SCORING_GUIDELINE = '/api/scoring-guideline/all';

const getScoringGuidelines = (
  url: string,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const deleteScoringGuideline = (ids: string) => {
  return axios
    .delete(API_SCORING_GUIDELINE, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllScoringGuidelines = () => {
  return axios
    .delete(API_DELETE_ALL_SCORING_GUIDELINE)
    .then((resp) => resp.data);
};

const useScoringGuidelines = () => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    dataTotalCount,
    dataTotalPage,
    page,
    perPage,
    refreshPress,
    pagePress,
    perPagePress,
    sort,
    sortPress,
    setFilter,
    setPage,
    setPerPage,
    selectAllPress,
    selectOnePress,
    selected,
    isSelectedAll,
    deletePress,
    isDeleteLoading,
    nextPress,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_SCORING_GUIDELINE,
    fetcher: getScoringGuidelines,
    fetcherDelete: deleteScoringGuideline,
    fetcherDeleteAll: deleteAllScoringGuidelines,
  });

  return {
    scoringGuidelines: data,
    isScoringGuidelineEmpty: isDataEmpty,
    isScoringGuidelineLoading: isDataLoading,
    isScoringGuidelineError: isDataError,
    scoringGuidelineTotalCount: dataTotalCount,
    scoringGuidelineTotalPage: dataTotalPage,
    scoringGuidelinePage: page,
    scoringGuidelinePerPage: perPage,
    scoringGuidelineRefreshPress: refreshPress,
    scoringGuidelinePagePress: pagePress,
    scoringGuidelinePerPagePress: perPagePress,
    scoringGuidelineSort: sort,
    scoringGuidelineSortPress: sortPress,
    setScoringGuidelineFilter: setFilter,
    setScoringGuidelinePage: setPage,
    setScoringGuidelinePerPage: setPerPage,
    scoringGuidelineSelectAllPress: selectAllPress,
    scoringGuidelineSelectOnePress: selectOnePress,
    scoringGuidelineSelected: selected,
    isScoringGuidelineSelectedAll: isSelectedAll,
    scoringGuidelineDeletePress: deletePress,
    isScoringGuidelineDeleteLoading: isDeleteLoading,
    scoringGuidelineNextPress: nextPress,
    scoringGuidelineNextFivePagePress: nextFivePagePress,
    scoringGuidelinePrevFivePagePress: prevFivePagePress,
    scoringGuidelineFirstPagePress: firstPagePress,
    scoringGuidelineLastPagePress: lastPagePress,
  };
};

export default useScoringGuidelines;
