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
  map,
  uniq,
} from 'lodash';
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
  placeholder?: string;
  label: string;
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

const InputDropdownRemoteCheckbox = ({
  label,
  formik: { errors, touched, values, setFieldValue },
  name,
  placeholder = '',
  initialOptions = [],
  apiFetcher,
  apiSort,
  apiFilter,
  apiPerPage = 10,
  apiSearchKeys,
  apiTextKey = [],
  apiValueKey,
  onChange,
  className = '',
  ...rest
}: InputDropdownRemoteCheckboxProps) => {
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
    (_e, { value: newValue }) => {
      const findVal = value?.find((val) => val === newValue);
      let currValues;
      if (findVal) {
        currValues = value?.filter((val) => val !== newValue);
      } else {
        currValues = uniq([...value, newValue]);
      }
      setFieldValue(name, currValues);
      onChange?.(value);
    },
    [setFieldValue],
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
          text: map(apiTextKey, (key: string) => get(d, key)).join(' - '),
        });
      });
      setOptions(uniqBy([...newOptions, ...selectedOptions], 'key'));
    }
  }, [data, selectedOptions]);

  const checkOption = (option: Options) => {
    const findOpt = value?.find((val) => val === option.value);
    return findOpt;
  };

  const textDropdown = () => {
    let text = label || 'Filter';
    if (selectedOptions?.length) {
      text += ` : ${selectedOptions[0].text || ''}  `;
    }

    if (selectedOptions?.length > 1) {
      text += ` ( + ${selectedOptions?.length - 1})`;
    }

    return text;
  };

  const _onClear = useCallback(() => {
    setFieldValue(name, []);
    onChange?.([]);
  }, [setFieldValue]);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <Dropdown
        {...rest}
        text={textDropdown()}
        // icon={'filter'}
        selection
        // floating
        labeled
        // button
        className={`icon ${className}`}
        loading={isLoading}
        search
        placeholder={placeholder}
        onSearchChange={onSearchChange}
        onFocus={_onFocus}
        noResultsMessage={
          data ? 'No results found.' : errorMessage || 'Type something'
        }
      >
        <Dropdown.Menu>
          {/* <Dropdown.Menu scrolling>
            {options.map((option) => (
              <Dropdown.Item
                {...option}
                key={option.key}
                icon={checkOption(option) ? 'check square' : 'square outline'}
                onClick={_onChange}
              />
            ))}
          </Dropdown.Menu> */}
          {options.map((option) => (
            <Dropdown.Item
              {...option}
              key={option.key}
              icon={checkOption(option) ? 'check square' : 'square outline'}
              onClick={_onChange}
            />
          ))}
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

export default InputDropdownRemoteCheckbox;
