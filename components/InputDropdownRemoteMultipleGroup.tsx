import React, { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Dropdown,
  DropdownProps,
  Icon,
  SemanticICONS,
} from 'semantic-ui-react';
import { FormikProps } from 'formik';
import {
  forEach,
  set,
  get,
  uniqBy,
  without,
  isEmpty,
  differenceBy,
  uniq,
  map,
  find,
} from 'lodash';
import useFetch from '../lib/data/_useFetch';

type Options = {
  key: string;
  text: string;
  value: string;
  content?: any;
};

type SegmentOptionProps = {
  text: string;
  description?: string;
  iconName?: SemanticICONS;
  value?: any;
};

type InputDropdownRemoteMultipleGroupProps = {
  icon?: string;
  placeholder: string;
  label: string;
  name: string;
  formik: FormikProps<any>;
  apiFetcher: any;
  apiSort?: any;
  apiFilter?: any;
  apiFilterSetKey?: string[];
  apiPerPage?: number;
  apiSearchKeys: string[];
  apiTextKey: string[];
  apiDescKey: string;
  apiValueKey: string;
  initialOptions?: Options[];
  apiFetcherGroup: any;
  apiSortGroup?: any;
  apiFilterGroup?: any;
  apiPerPageGroup?: number;
  apiSearchKeysGroup: string[];
  apiTextKeyGroup: string[];
  apiValueKeyGroup: string;
  apiDescKeyGroup: string;
  initialOptionsGroup?: Options[];
  headerGroup?: string;
  header?: string;
  additionalDescGroup?: string;
} & DropdownProps;

const InputDropdownRemoteMultipleGroup = ({
  icon = 'user',
  label,
  formik: { errors, touched, values, setFieldValue },
  name,
  placeholder,
  initialOptions = [],
  apiFetcher,
  apiSort,
  apiFilter,
  apiFilterSetKey = [],
  apiPerPage = 5,
  apiSearchKeys,
  apiTextKey = [],
  apiDescKey,
  apiValueKey,
  apiFetcherGroup,
  apiSortGroup,
  apiFilterGroup,
  apiPerPageGroup = 5,
  apiSearchKeysGroup,
  apiTextKeyGroup = [],
  apiValueKeyGroup,
  apiDescKeyGroup,
  headerGroup = 'Position Group',
  additionalDescGroup = '',
  initialOptionsGroup = [],
  header = name,
  ...rest
}: InputDropdownRemoteMultipleGroupProps) => {
  const [value, setValue] = useState<any>([]);
  const [options, setOptions] = useState<Options[]>([]);
  const [groupOptions, setGroupOptions] = useState<Options[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [selectedGroupOptions, setSelectedGroupOptions] =
    useState<Options | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onError = useCallback(() => {
    setErrorMessage('Something went wrong');
  }, []);
  const { data, isLoading, fetch } = useFetch({
    fetcher: apiFetcher,
    onError,
  });
  const {
    data: dataGroup,
    isLoading: isLoadingGroup,
    fetch: fetchGroup,
  } = useFetch({
    fetcher: apiFetcherGroup,
    onError,
  });

  const onSearchChange = useCallback(
    (_e, { searchQuery }) => {
      if (searchQuery) {
        const newFilter = {};
        const groupFilter = {};
        forEach(apiSearchKeysGroup, (apiKey) => {
          set(groupFilter, apiKey, searchQuery);
        });
        if (selectedGroupOptions) {
          forEach(apiFilterSetKey, (apiKey) => {
            set(newFilter, apiKey, selectedGroupOptions.value);
          });
        } else {
          forEach(apiSearchKeys, (apiKey) => {
            set(newFilter, apiKey, searchQuery);
          });
        }
        fetch(
          undefined,
          { ...apiFilter, ...newFilter },
          apiSort,
          1,
          apiPerPage,
          'and',
        );
        fetchGroup(
          undefined,
          { ...apiFilterGroup, ...groupFilter },
          apiSortGroup,
          1,
          apiPerPageGroup,
          'and',
        );
      }
    },
    [
      apiPerPage,
      apiSearchKeys,
      apiSort,
      apiFilter,
      apiFilterSetKey,
      fetch,
      apiPerPageGroup,
      apiSearchKeysGroup,
      apiSortGroup,
      apiFilterGroup,
      fetchGroup,
      selectedGroupOptions,
    ],
  );

  const onFilterGroup = useCallback(
    (_e, { value, text, content }) => {
      if (value && text && content) {
        const description = content?.props?.description || '';
        const descVal = content?.props?.value;
        setSelectedGroupOptions({
          value,
          key: value,
          text,
          content: {
            description,
            text,
            value: descVal,
          },
        });
        let limit = apiPerPage;
        if (Number(descVal)) {
          limit = Number(descVal);
        }
        const newFilter = {};
        forEach(apiFilterSetKey, (apiKey) => {
          set(newFilter, apiKey, value);
        });
        fetch(
          undefined,
          { ...apiFilter, ...newFilter },
          apiSort,
          1,
          limit,
          'and',
        );
      } else {
        setSelectedGroupOptions(null);
        fetch(undefined, { ...apiFilter }, apiSort, 1, apiPerPage, 'and');
      }
    },
    [apiPerPage, apiSearchKeys, apiSort, apiFilter, fetch, apiFilterSetKey],
  );

  const onChange = useCallback(
    (_e, { name, value: val }) => {
      if (typeof val === 'string') {
        const curValues = get(values, name) || [];
        const newVal = uniq([...curValues, val]);
        setFieldValue(name, newVal);
        setValue(newVal);
        const findVal = options.find((opt) => opt.value === val);
        if (findVal) {
          const currSelectedOpt = uniqBy([...selectedOptions, findVal], 'key');
          setSelectedOptions(currSelectedOpt);
          setOptions(differenceBy(options, currSelectedOpt, 'key'));
        }
      } else {
        setFieldValue(name, val);
        setValue(val);
        const currSelected: any[] = [];
        const currOpt = [...options];
        forEach(selectedOptions, (opt) => {
          const findVal = val?.find((v: string) => v === opt?.value);
          if (findVal) {
            currSelected.push(opt);
          } else {
            currOpt.push(opt);
          }
        });
        const newSelectedOpts = without(currSelected, undefined);
        setSelectedOptions(newSelectedOpts);
        setOptions(uniqBy(currOpt, 'key'));
      }
    },
    [value, options],
  );

  useEffect(() => {
    if (!isEmpty(initialOptions) && isEmpty(options))
      setOptions(initialOptions);
  }, [initialOptions]);

  useEffect(() => {
    if (!isEmpty(initialOptionsGroup) && isEmpty(groupOptions))
      setGroupOptions(initialOptionsGroup);
  }, [initialOptionsGroup]);

  // populate data
  useEffect(() => {
    const curValues = get(values, name);
    const curSelected: any[] = [];
    if (!isEmpty(curValues) && !isEmpty(initialOptions) && isEmpty(value)) {
      forEach(curValues, (val) => {
        curSelected.push(find([...options, ...initialOptions], ['key', val]));
      });
      setSelectedOptions(without(curSelected, undefined));
      setValue(get(values, name));
    }
  }, [get(values, name)]);

  useEffect(() => {
    if (data?.data) {
      const newOptions: Options[] = [];
      const currSelectedOpt = [...selectedOptions];
      const currValues = [...value];
      forEach(data?.data, (d) => {
        const temp = {
          key: get(d, apiValueKey),
          value: get(d, apiValueKey),
          text: map(apiTextKey, (key) => get(d, key)).join(' - '),
          content: (
            <OptionSegment
              text={map(apiTextKey, (key) => get(d, key)).join(' - ')}
              description={get(d, apiDescKey)}
            />
          ),
        };
        if (selectedGroupOptions) {
          currSelectedOpt.push(temp);
          currValues.push(temp.value);
        } else {
          newOptions.push(temp);
        }
      });
      const newSelectedOpt = uniqBy(currSelectedOpt, 'key');
      const newValue = uniq(currValues);
      setSelectedOptions(newSelectedOpt);
      setOptions(differenceBy(newOptions, newSelectedOpt, 'key'));
      setFieldValue(name, newValue);
      setValue(newValue);
    }
  }, [data, selectedGroupOptions]);

  useEffect(() => {
    if (dataGroup?.data) {
      const newOptions: Options[] = [];
      forEach(dataGroup?.data, (d) => {
        newOptions.push({
          key: get(d, apiValueKeyGroup),
          value: get(d, apiValueKeyGroup),
          text: map(apiTextKeyGroup, (key) => get(d, key)).join(' - '),
          content: (
            <OptionSegment
              text={map(apiTextKeyGroup, (key) => get(d, key)).join(' - ')}
              description={`${additionalDescGroup} ${get(d, apiDescKeyGroup)}`}
              value={get(d, apiDescKeyGroup)}
            />
          ),
        });
      });
      setGroupOptions(uniqBy([...newOptions], 'key'));
    }
  }, [dataGroup]);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{label}</label>
      <Dropdown
        {...rest}
        multiple
        fluid
        selection
        search
        placeholder={placeholder}
        name={name}
        value={value}
        options={
          selectedGroupOptions
            ? [...options, selectedGroupOptions, ...selectedOptions]
            : [...options, ...groupOptions, ...selectedOptions]
        }
        onChange={onChange}
        onSearchChange={onSearchChange}
        loading={isLoading || isLoadingGroup}
        noResultsMessage={
          data ? 'No results found.' : errorMessage || 'Type something'
        }
      >
        <Dropdown.Menu>
          <Dropdown.Header icon={'group'} content={headerGroup} />
          {selectedGroupOptions ? (
            <Dropdown.Item
              {...selectedGroupOptions}
              style={{ marginLeft: '1em' }}
              onClick={() => setSelectedGroupOptions(null)}
            >
              <OptionSegment
                description={selectedGroupOptions.content?.description}
                text={selectedGroupOptions.text}
                iconName="close"
              />
            </Dropdown.Item>
          ) : !groupOptions?.length || !groupOptions || errorMessage ? (
            <Dropdown.Item
              style={{ marginLeft: '1em' }}
              text={
                dataGroup
                  ? `No ${headerGroup} Found`
                  : errorMessage || 'Type something'
              }
              disabled={true}
            />
          ) : (
            groupOptions?.map((opt) => (
              <Dropdown.Item
                {...opt}
                key={opt.key}
                style={{ marginLeft: '1em' }}
                name={name}
                onClick={onFilterGroup}
              />
            ))
          )}
          <Dropdown.Divider />
          <Dropdown.Header icon={icon} content={header} />
          {!options?.length || !options || errorMessage ? (
            <Dropdown.Item
              style={{ marginLeft: '1em' }}
              text={data ? 'No Result Found' : errorMessage || 'Type something'}
              disabled={true}
            />
          ) : (
            options?.map((opt) => (
              <Dropdown.Item
                {...opt}
                key={opt.key}
                style={{ marginLeft: '1em' }}
                name={name}
                onClick={onChange}
              />
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export const OptionSegment = ({
  text,
  description,
  iconName,
  value,
}: SegmentOptionProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.3em',
      }}
      defaultValue={value}
    >
      <div>
        <div style={{ fontWeight: 'bolder', marginBottom: '.6em' }}>{text}</div>
        {description && (
          <span style={{ color: 'GrayText' }}>{description}</span>
        )}
      </div>
      {iconName && (
        <div>
          <Icon name={iconName} className="right" />
        </div>
      )}
    </div>
  );
};

export default InputDropdownRemoteMultipleGroup;
