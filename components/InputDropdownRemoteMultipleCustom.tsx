import React, { useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps, Label } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { find, forEach, set, get, uniqBy, without, isEmpty, map } from 'lodash';
import useFetch from '../lib/data/_useFetch';

type Options = {
  key: string;
  text: string;
  value: string;
  content: any;
};

type FormikCustom = {
  errors: any;
  setFieldValue: any;
  values: any;
  touched: any;
};

type InputDropdownRemoteMultipleProps = {
  placeholder: string;
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
  apiDescKey: string;
  apiLabelKey: string;
  initialOptions?: Options[];
} & DropdownProps;

type SegmentOptionProps = {
  text: string;
  description: string;
  label: string;
};

const InputDropdownRemoteMultipleCustom = ({
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
  apiTextKey = [],
  apiValueKey,
  apiDescKey,
  apiLabelKey,
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

  const onChange = useCallback(
    (_e, { name, value }) => {
      setFieldValue(name, value);
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
          content: (
            <OptionSegment
              text={map(apiTextKey, (key: string) => get(d, key)).join(' - ')}
              description={get(d, apiDescKey)}
              label={get(d, apiLabelKey)}
            />
          ),
        });
      });
      setOptions(uniqBy([...newOptions, ...selectedOptions], 'key'));
    }
  }, [data, selectedOptions]);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{label}</label>
      <Dropdown
        {...rest}
        multiple
        fluid
        selection
        search
        loading={isLoading}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        options={options}
        value={value}
        onSearchChange={onSearchChange}
        noResultsMessage={
          data ? 'No results found.' : errorMessage || 'Type something'
        }
        onFocus={_onFocus}
      />
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

const OptionSegment = ({ text, description, label }: SegmentOptionProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.3em',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontWeight: 'bolder', marginBottom: '.6em' }}>{text}</div>
        {description && (
          <span style={{ color: 'GrayText' }}>{description}</span>
        )}
      </div>
      {label && (
        <div>
          <Label circular color="teal">
            {label}
          </Label>
        </div>
      )}
    </div>
  );
};

export default InputDropdownRemoteMultipleCustom;
