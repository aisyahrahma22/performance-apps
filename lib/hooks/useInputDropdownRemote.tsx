import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import useFetch from '../data/_useFetch';
import DropdownOptions from '../types/DropdownOptions';
import { includes, join, map, size } from 'lodash';
import { OptionSegment } from '../../components/InputDropdownRemoteMultipleGroup';
import renderHyphen from '../util/renderHyphen';
import renderDate from '../util/renderDate';

type FormikCustomProps = {
  errors?: any;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
  values?: any;
  touched?: any;
  setFieldTouched?: any;
};

type UseInputDropdownRemoteProps = {
  name: string;
  multiple?: boolean;
  formik: FormikCustomProps;
  apiFetcher: any;
  apiSort?: any;
  apiFilter?: any;
  apiPerPage?: number;
  apiSearchKeys?: string[];
  apiTextKey?: string | string[];
  apiValueKey?: string;
  apiDescKey?: string[];
  apiLabelKey?: string;
  initialOptions?: DropdownOptions[];
  selectedOptions?: DropdownOptions[];
  onChange?: any;
  enableTextValue?: boolean;
  enableMaxValue?: boolean;
  maxValue?: number;
  choosenOption?: string[];
};

type UseInputDropdownRemoteReturnProps = {
  value: string | string[];
  options: DropdownOptions[];
  selectedOptions: any;
  addedOptions: any;
  errorMessage: string | null;
  allowAdditions: boolean;
  data: any;
  isLoading: boolean;
  setValue: Dispatch<SetStateAction<string | string[]>>;
  setOptions: Dispatch<SetStateAction<DropdownOptions[]>>;
  setSelectedOptions: Dispatch<SetStateAction<any>>;
  setAddedOptions: Dispatch<SetStateAction<any>>;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  setAllowAdditions: Dispatch<SetStateAction<boolean>>;
  updateSelectedItem: (
    _multiple: boolean,
    _value: string | string[],
    _options: DropdownOptions[],
    _localInitOptions: DropdownOptions[],
  ) => void;
  onError: () => void;
  _onSearchChange: ({ target }: any, { searchQuery }: any) => void;
  _onChange: (_e: any, { name, value }: any) => void;
  _onBlur: () => void;
  _onFocus: () => void;
  _onAddItem: (_e: any, { value }: any) => void;
};

const isDropdownMultiple = (multiple: boolean): string | string[] =>
  multiple ? [] : '';

function useInputDropdownRemote({
  formik: { values, setFieldValue, setFieldTouched },
  name,
  multiple = false,
  initialOptions = [],
  apiFetcher,
  apiSort,
  apiFilter,
  apiPerPage = 5,
  apiSearchKeys,
  apiTextKey,
  apiValueKey,
  apiDescKey,
  onChange,
  enableTextValue,
  choosenOption = [],
}: UseInputDropdownRemoteProps): UseInputDropdownRemoteReturnProps {
  const [value, setValue] = useState<string | string[]>(
    isDropdownMultiple(multiple),
  );
  const [prevValue, setPrevValue] = useState<string | string[]>(
    isDropdownMultiple(multiple),
  );
  const [options, setOptions] = useState<DropdownOptions[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<DropdownOptions[]>([]);
  const [addedOptions, setAddedOptions] = useState<DropdownOptions[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allowAdditions, setAllowAdditions] = useState(false);

  if (prevValue !== get(values, name)) {
    const updatedValueFromParent = get(values, name);
    setPrevValue(updatedValueFromParent);
    setValue(updatedValueFromParent);
  }

  // callback hooks to handle when component throws error
  const onError = useCallback(() => {
    setErrorMessage('Something went wrong');
  }, []);

  // custom hooks to handle API-fetch data ability
  const { data, isLoading, fetch } = useFetch({
    fetcher: apiFetcher,
    onError,
  });

  // callback hooks to handle when dropdown's search value is change
  const _onSearchChange = useCallback(
    ({ target }, { searchQuery }) => {
      if (searchQuery && apiFetcher) {
        const newFilter = {};
        forEach(apiSearchKeys, (apiKey) => {
          set(newFilter, apiKey, searchQuery);
        });
        enableTextValue && setFieldValue?.(name, target?.value);
        fetch(
          undefined,
          { ...apiFilter, ...newFilter },
          apiSort,
          1,
          apiPerPage,
        );
      }
    },
    [
      apiFetcher,
      apiFilter,
      apiPerPage,
      apiSearchKeys,
      apiSort,
      enableTextValue,
      fetch,
      name,
      setFieldValue,
    ],
  );

  // function that update updated value to selectedOptions so it cannot be selected again
  const updateSelectedItem = (
    _multiple: boolean,
    _value: string | string[],
    _options: DropdownOptions[],
    _localInitOptions: DropdownOptions[],
  ) => {
    if (!_value || _value.length <= 0 || _value === '') return;

    const copyOfAllOption = cloneDeep([..._options, ..._localInitOptions]);
    if (_multiple) {
      const filteredOption = copyOfAllOption.filter((elem) => {
        if (isArray(_value)) {
          const foundValue = _value.some((element) => elem.key === element);
          return foundValue;
        }
        return false;
      });
      setSelectedOptions(filteredOption);
    } else if (!isArray(_value)) {
      const filteredOption = copyOfAllOption.filter(
        (elem) => elem.key === _value.toString(),
      );
      setSelectedOptions(filteredOption);
    }
  };

  // evemt handler function when dropdown value changes
  const _onChange = useCallback(
    (_e, { name, value }) => {
      setFieldValue?.(name, value);
      updateSelectedItem(multiple, value, options, initialOptions);
      onChange?.(find(data?.data, ({ id }) => id === value));
    },
    [setFieldValue, multiple, options, initialOptions, onChange, data?.data],
  );

  // event handler function when mouse is onblur from dropdown
  const _onBlur = useCallback(() => {
    setFieldTouched?.(name, true);
    if (!value) return;
    if (!data?.totalCount && enableTextValue && !multiple) {
      const currentValue = value.toString();
      setOptions([
        {
          key: currentValue,
          value: currentValue,
          text: currentValue,
        },
      ]);
    }
  }, [value, data?.totalCount, enableTextValue, multiple]);

  // event handler function when mouse is onfocus from dropdown
  const _onFocus = useCallback(() => {
    if (apiFetcher && !enableTextValue) {
      fetch(undefined, apiFilter, apiSort, 1, apiPerPage);
    }
  }, [apiFetcher, apiFilter, apiPerPage, apiSort, fetch, enableTextValue]);

  // callback hooks to handle when items are added to the dropdown
  const _onAddItem = useCallback((_e, { value }) => {
    const newOptions: DropdownOptions[] = [
      {
        key: value,
        value: value,
        text: value,
      },
    ];
    setAddedOptions(newOptions);
  }, []);

  // sync options with initialOptions if there is any
  const [prevInitialOptions, setPrevInitialOptions] = useState<
    DropdownOptions[]
  >([]);
  if (
    !isEmpty(initialOptions) &&
    !isEqual(initialOptions, prevInitialOptions)
  ) {
    if (multiple) {
      setPrevInitialOptions(initialOptions);
      setSelectedOptions(initialOptions);
      setOptions(initialOptions);
      setValue(initialOptions.map((elem) => elem.value));
    } else {
      setPrevInitialOptions(initialOptions);
      setSelectedOptions(initialOptions);
      setOptions(initialOptions);
      setValue(initialOptions[0].value);
    }
  }

  // use effect to check if user searched option with new value
  const { current: newChoosenOption } = useRef(choosenOption);
  useEffect(() => {
    if (data?.data && apiValueKey && apiTextKey && !isArray(apiTextKey)) {
      const newOptions: DropdownOptions[] = [];
      forEach(data?.data, (d) => {
        if (!newChoosenOption?.includes(get(d, apiValueKey))) {
          newOptions.push({
            key: get(d, apiValueKey),
            value: get(d, apiValueKey),
            text: get(d, apiTextKey),
          });
        }
      });

      const combinedOption = uniqBy(
        [...newOptions, ...selectedOptions, ...addedOptions],
        'key',
      );

      setOptions(combinedOption);
    } else if (data?.data && apiValueKey && size(apiTextKey) > 0) {
      // handle apiTextKey [] and will join with '-' and apiDescKey with '|'
      const newOptions: DropdownOptions[] = [];
      forEach(data?.data, (d) => {
        newOptions.push({
          key: get(d, apiValueKey),
          value: get(d, apiValueKey),
          text: map(apiTextKey, (key: string) => get(d, key)).join(' - '),
          content: (
            <OptionSegment
              text={map(apiTextKey, (key) => get(d, key)).join(' - ')}
              description={join(
                map(apiDescKey, (key) =>
                  includes(key, 'startDate') || includes(key, 'endDate')
                    ? renderDate(get(d, key))
                    : renderHyphen(get(d, key)),
                ),
                ' | ',
              )}
            />
          ),
        });
      });

      const combinedOption = uniqBy(
        [...newOptions, ...selectedOptions, ...addedOptions],
        'key',
      );

      setOptions(combinedOption);
    }
  }, [
    addedOptions,
    apiTextKey,
    apiValueKey,
    data,
    newChoosenOption,
    selectedOptions,
  ]);

  // all returned value
  const _state = {
    value,
    options,
    selectedOptions,
    addedOptions,
    errorMessage,
    allowAdditions,
    data,
    isLoading,
  };
  const _setState = {
    setValue,
    setOptions,
    setSelectedOptions,
    setAddedOptions,
    setErrorMessage,
    setAllowAdditions,
  };
  const _normalFunc = { updateSelectedItem };
  const _hooksFunc = {
    onError,
    _onSearchChange,
    _onChange,
    _onBlur,
    _onFocus,
    _onAddItem,
  };

  return {
    ..._state,
    ..._setState,
    ..._normalFunc,
    ..._hooksFunc,
  };
}

export default useInputDropdownRemote;
