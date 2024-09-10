import { Icon, Pagination } from 'semantic-ui-react';
import React from 'react';

const TablePaginationNew = ({
  pagePress,
  totalPage,
  activePage,
  nextFivePagePress,
  prevFivePagePress,
  firstPagePress,
  lastPagePress,
}: {
  pagePress: any;
  totalPage: number;
  activePage: number;
  nextFivePagePress: any;
  prevFivePagePress: any;
  firstPagePress: any;
  lastPagePress: any;
}) => {
  return (
    <div
      className="ui tiny pagination primary right floated menu"
      aria-label="Pagination Navigation"
      role="navigation"
    >
      <a
        aria-current="false"
        aria-disabled="false"
        className="item"
        onClick={() => firstPagePress(totalPage)}
      >
        First
      </a>
      <a
        aria-current="false"
        aria-disabled="false"
        className="icon item"
        onClick={() => prevFivePagePress(activePage)}
      >
        <Icon name="angle double left" />
      </a>
      <Pagination
        onPageChange={pagePress}
        totalPages={totalPage || 0}
        activePage={activePage || 0}
        boundaryRange={1}
        secondary
        ellipsisItem={{
          content: <Icon name="ellipsis horizontal" />,
          icon: true,
        }}
        firstItem={null}
        lastItem={null}
        prevItem={{
          content: <Icon name="angle left" />,
          icon: true,
        }}
        nextItem={{
          content: <Icon name="angle right" />,
          icon: true,
        }}
        size={'tiny'}
      />
      <a
        aria-current="false"
        aria-disabled="false"
        className="icon item"
        style={{ alignContent: 'center' }}
        onClick={() => nextFivePagePress({ activePage, totalPage })}
      >
        <Icon name="angle double right" color="black" />
      </a>
      <a
        aria-current="false"
        aria-disabled="false"
        className="item"
        onClick={() => lastPagePress(totalPage)}
      >
        Last
      </a>
    </div>
  );
};

export default TablePaginationNew;
