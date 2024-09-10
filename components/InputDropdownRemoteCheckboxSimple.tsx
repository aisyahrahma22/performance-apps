import React, { useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { forEach, get, map, remove } from 'lodash';
import useFetch from '../lib/data/_useFetch';

type Options = {
  key: string;
  text: string;
  value: string;
  icon?: string;
};

type FormikCustom = {
  errors: any;
  setFieldValue: any;
  values: any;
  touched: any;
};

type InputDropdownRemoteCheckboxProps = {
  name: string;
  formik: FormikProps<any> | FormikCustom;
  apiFetcher: any;
  apiSort?: any;
  apiFilter?: any;
  apiPerPage?: number;
  apiSearchKeys: string[];
  apiTextKey: string[];
  apiValueKey: string;
  initialOptions?: Options[];
  onChange?: any;
  className?: string;
} & DropdownProps;

const InputDropdownRemoteCheckboxSimple = ({
  formik: { errors, touched, values, setFieldValue },
  name,
  apiFetcher,
  apiSort,
  apiFilter,
  apiPerPage = 100,
  apiTextKey = [],
  apiValueKey,
  onChange,
  className = '',
  ...rest
}: InputDropdownRemoteCheckboxProps) => {
  // const [value, setValue] = useState([]);
  const [options, setOptions] = useState<Options[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onError = useCallback(() => {
    setErrorMessage('Something went wrong');
  }, []);
  const { data, isLoading, fetch } = useFetch({
    fetcher: apiFetcher,
    onError,
  });
  // console.log({ data });
  const _onChange = useCallback(
    (_e, { value: newValue }) => {
      const findVal = get(values, name)?.find((val: any) => val === newValue);
      if (findVal) {
        const newItems = [...get(values, name)];
        remove(newItems, (i) => i === newValue);
        setFieldValue(name, newItems);
      } else {
        const newItems = [...get(values, name), newValue];
        setFieldValue(name, newItems);
      }
    },
    [get(values, name)],
  );

  useEffect(() => {
    fetch(undefined, apiFilter, apiSort, 1, apiPerPage);
  }, []);

  const _onFocus = useCallback(() => {
    if (apiFetcher) {
      fetch(undefined, apiFilter, apiSort, 1, apiPerPage);
    }
  }, [apiFilter, apiPerPage, apiSort, fetch]);

  useEffect(() => {
    if (data?.data && !isLoading) {
      const newOptions: Options[] = [];
      forEach(data?.data, (d) => {
        newOptions.push({
          key: get(d, apiValueKey),
          value: get(d, apiValueKey),
          text: map(apiTextKey, (key: string) => get(d, key)).join(' - '),
        });
      });
      setOptions(newOptions);
    }
  }, [data?.data?.length, isLoading]);

  useEffect(() => {
    if (values.la.length === 0) {
      const valueArr = options.map((option) => option.value);
      setFieldValue(name, valueArr);
    }
  }, [options]);

  const checkOption = (option: Options) => {
    const findOpt = get(values, name)?.find((val: any) => val === option.value);
    return findOpt;
  };

  const _onClear = useCallback(() => {
    setFieldValue(name, []);
    onChange?.([]);
  }, [setFieldValue]);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <Dropdown
        {...rest}
        className={`icon ${className}`}
        loading={isLoading}
        search
        direction="left"
        icon={'setting'}
        onFocus={_onFocus}
        noResultsMessage={
          data ? 'No results found.' : errorMessage || 'Type something'
        }
      >
        <Dropdown.Menu>
          <Dropdown.Menu scrolling>
            {options.map((option) => (
              <Dropdown.Item
                {...option}
                key={option.key}
                icon={checkOption(option) ? 'check square' : 'square outline'}
                onClick={_onChange}
              />
            ))}
          </Dropdown.Menu>
          <div
            style={{ cursor: 'pointer', margin: '15px', color: 'GrayText' }}
            onClick={_onClear}
          >
            <span>Clear selection</span>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export default InputDropdownRemoteCheckboxSimple;
