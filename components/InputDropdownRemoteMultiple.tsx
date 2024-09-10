import React, { useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import {
  find,
  forEach,
  set,
  get,
  uniqBy,
  without,
  isEmpty,
  toUpper,
  take,
} from 'lodash';
import useFetch from '../lib/data/_useFetch';

export type Options = {
  key: string;
  text: string;
  value: string;
};

type InputDropdownRemoteMultipleProps = {
  placeholder: string;
  label: string;
  name: string;
  formik: FormikProps<any>;
  apiFetcher: any;
  apiSort?: any;
  apiFilter?: any;
  apiPerPage?: number;
  apiSearchKeys: string[];
  apiTextKey: string;
  apiValueKey: string;
  initialOptions?: Options[];
  onChange?: any;
  enableTextValue?: boolean;
  enableMaxValue?: boolean;
  maxValue?: number;
} & DropdownProps;

const InputDropdownRemoteMultiple = ({
  label,
  formik: { errors, touched, values, setFieldValue },
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
  enableTextValue = false,
  enableMaxValue = false,
  maxValue = 5,
  ...rest
}: InputDropdownRemoteMultipleProps) => {
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState<Options[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onError = useCallback(() => {
    setErrorMessage('Something went wrong');
  }, []);
  const { data, isLoading, fetch } = useFetch({
    fetcher: apiFetcher,
    onError,
  });
  const [allowAdditions, setAllowAdditions] = useState(false);

  const onSearchChange = useCallback(
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

  const _onChange = useCallback(
    (_e, { name, value: _value }) => {
      if (enableMaxValue) {
        _value = take(_value, maxValue);
      }
      setFieldValue(name, _value);
      const currOptions = options;
      if (allowAdditions && _value?.length) {
        const val = _value[_value.length - 1];
        const newOpt: Options = {
          text: val,
          key: val,
          value: val,
        };
        currOptions.push(newOpt);
        setOptions(uniqBy(currOptions, 'key'));
      }
      const selectedOpt = _value?.map((val: string) =>
        find(currOptions, (opt: any) => opt?.value === val),
      );
      onChange?.(_value, { options: selectedOpt });
    },
    [
      setFieldValue,
      options,
      allowAdditions,
      enableMaxValue,
      maxValue,
      onChange,
    ],
  );

  useEffect(() => {
    const curValues = get(values, name);
    const curSelected: any[] = [];
    forEach(curValues, (val) => {
      curSelected.push(find([...options, ...initialOptions], ['key', val]));
    });
    setSelectedOptions(without(curSelected, undefined));
    setValue(get(values, name));
  }, [get(values, name)]);

  useEffect(() => {
    if (!isEmpty(initialOptions) && isEmpty(options))
      setOptions(initialOptions);
  }, [initialOptions]);

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
      setOptions(uniqBy([...newOptions, ...selectedOptions], 'key'));
      if (!data?.totalCount && enableTextValue) {
        setAllowAdditions(true);
      } else setAllowAdditions(false);
    }
  }, [data, selectedOptions, enableTextValue]);

  const _onKeyDown = useCallback(
    (e) => {
      if (
        e.key !== 'Backspace' &&
        enableMaxValue &&
        value?.length >= maxValue
      ) {
        e.preventDefault();
      }
    },
    [enableMaxValue, value],
  );

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{toUpper(label)}</label>
      <Dropdown
        {...rest}
        multiple
        fluid
        selection
        search
        loading={isLoading}
        placeholder={placeholder}
        name={name}
        onChange={_onChange}
        options={options}
        value={value}
        onSearchChange={onSearchChange}
        noResultsMessage={
          data
            ? `No ${enableTextValue ? 'suggestions' : 'results'} found.`
            : errorMessage || 'Type something'
        }
        allowAdditions={allowAdditions}
        onKeyDown={_onKeyDown}
      />
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export default InputDropdownRemoteMultiple;
