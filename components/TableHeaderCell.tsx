import { List, Table, TableHeaderCellProps as Props } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { toLower, toUpper } from 'lodash';

type TableHeaderCellProps = {
  attribute?: string;
  name: string;
  direction?: string;
  onSortPress?: any;
  sortable?: boolean;
} & Props;

const TableHeaderCell = ({
  attribute,
  sortable,
  onSortPress,
  direction,
  name,
  ...props
}: TableHeaderCellProps) => {
  const iconName = useMemo(() => {
    return direction ? `sort content ${toLower(direction)}ending` : 'sort';
  }, [direction]);
  return (
    <Table.HeaderCell
      className={sortable ? 'nopadding' : 'py-0 pr-0'}
      {...props}
    >
      <List selection={sortable} verticalAlign="middle">
        <List.Item onClick={onSortPress?.(attribute)} className={'radiusless'}>
          {sortable && (
            <List.Icon
              flipped={'horizontally'}
              name={iconName as any}
              verticalAlign="middle"
            />
          )}
          <List.Content>
            <List.Header>{toUpper(name)}</List.Header>
          </List.Content>
        </List.Item>
      </List>
    </Table.HeaderCell>
  );
};

export default TableHeaderCell;
