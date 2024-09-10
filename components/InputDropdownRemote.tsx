import React from 'react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { SemanticWIDTHS } from 'semantic-ui-react/src/generic';
import { FormikProps } from 'formik/dist/types';
import get from 'lodash/get';
import toUpper from 'lodash/toUpper';
import useInputDropdownRemote from '../lib/hooks/useInputDropdownRemote';
import DropdownOptions from '../lib/types/DropdownOptions';

type InputDropdownRemoteProps = {
  placeholder?: string;
  label: string;
  name: string;
  multiple?: boolean;
  formik: FormikProps<any>;
  apiFetcher?: any;
  apiSort?: any;
  apiFilter?: any;
  apiPerPage?: number;
  apiSearchKeys?: string[];
  apiTextKey?: string | string[];
  apiValueKey?: string;
  apiDescKey?: string[];
  initialOptions?: DropdownOptions[];
  onChange?: any;
  enableTextValue?: boolean;
  width?: SemanticWIDTHS;
  choosenOption?: string[];
} & DropdownProps;

const InputDropdownRemote = ({
  label,
  formik: { values, errors, touched, setFieldValue },
  name,
  multiple = false,
  placeholder,
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
  width,
  enableTextValue,
  choosenOption = [],
  ...rest
}: InputDropdownRemoteProps) => {
  const inputValue = {
    formik: { values, setFieldValue },
    name,
    multiple,
    initialOptions,
    apiFetcher,
    apiSort,
    apiFilter,
    apiPerPage,
    apiSearchKeys,
    apiTextKey,
    apiValueKey,
    apiDescKey,
    onChange,
    enableTextValue,
    choosenOption,
  };
  const {
    data,
    value,
    options,
    isLoading,
    errorMessage,
    _onChange,
    _onBlur,
    _onSearchChange,
    _onFocus,
    _onAddItem,
  } = useInputDropdownRemote(inputValue);

  return (
    <Form.Field width={width} error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{toUpper(label)}</label>
      <Dropdown
        {...rest}
        multiple={multiple}
        fluid
        selection
        search
        loading={isLoading}
        placeholder={placeholder}
        name={name}
        onChange={_onChange}
        onBlur={_onBlur}
        onKeyDown={({ code }: any) => code == 'Enter' && _onBlur()}
        options={options}
        value={value}
        onSearchChange={_onSearchChange}
        noResultsMessage={
          data
            ? `No ${enableTextValue ? 'suggestions' : 'results'} found.`
            : errorMessage || 'Type something'
        }
        onFocus={_onFocus}
        onAddItem={_onAddItem}
      />
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export default InputDropdownRemote;
