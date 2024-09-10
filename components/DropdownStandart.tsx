import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { forEach, set, get, uniqBy, isEmpty } from 'lodash';
import useFetch from '../lib/data/_useFetch';

type Options = {
  key: string;
  text: string;
  value: string;
};

type DropdownStandartProps = {
  placeholder: string;
  name: string;
  apiFetcher: any;
  apiSort?: any;
  apiFilter?: any;
  apiPerPage?: number;
  apiSearchKeys: string[];
  apiTextKey: string;
  apiValueKey: string;
  initialOptions?: Options[];
  initialValue?: string;
  onChange?: any;
  passValue?: string;
} & DropdownProps;

const DropdownStandart = ({
  name,
  placeholder,
  initialOptions = [],
  apiFetcher,
  apiSort,
  apiFilter,
  apiPerPage = 5,
  apiSearchKeys,
  apiTextKey,
  apiValueKey,
  onChange,
  initialValue,
  ...rest
}: DropdownStandartProps) => {
  const [value, setValue] = useState<string>('');
  const [options, setOptions] = useState<Options[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onError = useCallback(() => {
    setErrorMessage('Something went wrong');
  }, []);

  const { data, isLoading, fetch } = useFetch({
    fetcher: apiFetcher,
    onError,
  });

  const _onChange = useCallback((_e, { value }) => {
    //   console.log('box'value)
    setValue(value);
    onChange?.(value);
  }, []);

  const _onSearchChange = useCallback(
    (_e, { searchQuery }) => {
      if (searchQuery) {
        const newFilter = {};
        forEach(apiSearchKeys, (apiKey) => {
          set(newFilter, apiKey, searchQuery);
        });
        fetch(
          undefined,
          { ...apiFilter, ...newFilter },
          apiSort,
          1,
          apiPerPage,
        );
      }
    },
    [apiPerPage, apiSearchKeys, apiSort, apiFilter, fetch],
  );

  const _onFocus = useCallback(() => {
    fetch(undefined, apiFilter, apiSort, 1, apiPerPage);
  }, [apiFilter, apiPerPage, apiSort, fetch]);

  useEffect(() => {
    if (!isEmpty(initialOptions)) {
      setOptions(initialOptions);
    }
  }, [initialOptions.length]);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (data?.data) {
      const newOptions: Options[] = [];
      forEach(data?.data, (d) => {
        newOptions.push({
          key: get(d, apiValueKey),
          value: get(d, apiValueKey),
          text: get(d, apiTextKey),
        });
      });
      setOptions(uniqBy([...newOptions], 'key'));
    }
  }, [data]);

  return (
    <Dropdown
      {...rest}
      selection
      search
      loading={isLoading}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={_onChange}
      options={options}
      onSearchChange={_onSearchChange}
      noResultsMessage={
        data ? 'No results found.' : errorMessage || 'Type something'
      }
      onFocus={_onFocus}
      selectOnBlur={false}
    />
  );
};

export default DropdownStandart;
