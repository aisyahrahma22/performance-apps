import React, { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Input as SURInput,
  InputProps as SURInputProps,
  Dropdown,
} from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, toUpper } from 'lodash';

type InputProps = {
  placeholder: string;
  label?: string;
  formik: FormikProps<any>;
  name: string;
  optionsDropdown?: any;
  defaultValue?: string;
  dropdownName: string;
} & SURInputProps;

const InputWithLabel = ({
  label,
  formik: { errors, touched, setFieldValue, values },
  name,
  placeholder,
  optionsDropdown,
  defaultValue,
  dropdownName,
  // initialOptions = [],
  ...rest
}: InputProps) => {
  const [inputValue, setInputValue] = useState<any>('');
  const [dropdownValue, setDropdownValue] = useState<any>(defaultValue);
  const _onChange = useCallback(
    (_e, { name, value }) => {
      setInputValue(value);
      setFieldValue(name, value);
      if (value) {
        // only set unit value if duration value exist
        setFieldValue(dropdownName, value + dropdownValue);
      } else {
        setFieldValue(dropdownName, null);
      }
    },
    [setFieldValue, setInputValue],
  );

  const _onChangeDropdown = useCallback(
    (_e, { value }) => {
      if (inputValue) setFieldValue(dropdownName, inputValue + value); // only set unit value if duration value exist
      setDropdownValue(value);
    },
    [setFieldValue, inputValue],
  );

  useEffect(() => {
    setInputValue(get(values, name));
    // setFieldValue(dropdownName, dropdownValue);
  }, [get(values, name)]);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{toUpper(label)}</label>
      <SURInput
        {...rest}
        fluid
        label={
          <Dropdown
            defaultValue={defaultValue}
            options={optionsDropdown}
            onChange={_onChangeDropdown}
          />
        }
        labelPosition={'right'}
        placeholder={placeholder}
        name={name}
        onChange={_onChange}
        value={inputValue}
      />
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export default InputWithLabel;
