import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_MAIL_TEMPLATE = '/api/mail/template';
const getMailTemplates = (
  url: string = API_MAIL_TEMPLATE,
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

const useMailTemplates = () => {
  const {
    data,
    isDataLoading,
    refreshPress,
    isDataEmpty,
    isDataError,
    dataTotalCount,
    sort,
    sortPress,
    page,
    pagePress,
    dataTotalPage,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_MAIL_TEMPLATE,
    fetcher: getMailTemplates,
  });

  return {
    mailTemplates: data,
    mailTemplatesRefreshPress: refreshPress,
    mailTemplatesTotalCount: dataTotalCount,
    mailTemplatesTotalPage: dataTotalPage,
    mailTemplatesPagePress: pagePress,
    mailTemplatesPage: page,
    mailTemplatesSort: sort,
    mailTemplatesSortPress: sortPress,
    isMailTemplatesEmpty: isDataEmpty,
    isMailTemplatesLoading: isDataLoading,
    isMailTemplatesError: isDataError,
    mailTemplatesNextFivePagePress: nextFivePagePress,
    mailTemplatesPrevFivePagePress: prevFivePagePress,
    mailTemplatesFirstPagePress: firstPagePress,
    mailTemplatesLastPagePress: lastPagePress,
  };
};

export default useMailTemplates;
