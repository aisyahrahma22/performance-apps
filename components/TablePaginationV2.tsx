import { Icon, Pagination } from 'semantic-ui-react';
import React from 'react';

const TablePaginationV2 = ({
  pagePress,
  totalPage,
  activePage,
}: {
  pagePress: any;
  totalPage: number;
  activePage: number;
}) => {
  return (
    <>
      <Pagination
        className={'v2'}
        onPageChange={pagePress}
        totalPages={totalPage || 0}
        defaultActivePage={activePage || 0}
        ellipsisItem={{
          content: <Icon name="ellipsis horizontal" />,
          icon: true,
        }}
        firstItem={{
          content: <b>First</b>,
          icon: false,
        }}
        lastItem={{
          content: <b>Last</b>,
          icon: false,
        }}
        prevItem={{
          content: <Icon name="angle left" />,
          icon: true,
        }}
        nextItem={{
          content: <Icon name="angle right" />,
          icon: true,
        }}
        floated="right"
        size={'mini'}
        secondary
      />
    </>
  );
};

export default TablePaginationV2;
