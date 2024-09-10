import { Icon, Pagination } from 'semantic-ui-react';
import React from 'react';

const TablePagination = ({
  pagePress,
  totalPage,
  activePage,
}: {
  pagePress: any;
  totalPage: number;
  activePage: number;
}) => {
  return (
    <Pagination
      onPageChange={pagePress}
      totalPages={totalPage || 0}
      defaultActivePage={activePage || 0}
      ellipsisItem={{
        content: <Icon name="ellipsis horizontal" />,
        icon: true,
      }}
      firstItem={{
        content: <Icon name="angle double left" />,
        icon: true,
      }}
      lastItem={{
        content: <Icon name="angle double right" />,
        icon: true,
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
    />
  );
};

export default TablePagination;
