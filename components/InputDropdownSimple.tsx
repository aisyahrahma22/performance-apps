import React, { useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps, Icon } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, toUpper } from 'lodash';

type InputDropdownRemoteProps = {
  placeholder: string;
  label: string;
  name: string;
  formik: FormikProps<any>;
  onChange?: any;
  isExclamation?: boolean;
} & DropdownProps;

const InputDropdownSimple = ({
  label,
  formik: { errors, touched, values, setFieldValue },
  name,
  placeholder,
  options,
  width,
  onChange,
  isExclamation,
  ...rest
}: InputDropdownRemoteProps) => {
  const [value, setValue] = useState<any>('');
  const [dropDownOptions, setDropDownOptions] = useState<any>(options);

  const _onAddItem = useCallback(
    (_e, { value }) => {
      setDropDownOptions((prevOptions: []) => [
        { text: value, value: value, key: value },
        ...prevOptions,
      ]);
      setFieldValue(name, value);
    },
    [setFieldValue],
  );

  const _onChange = useCallback(
    (_e, { value }) => {
      setFieldValue(name, value);
      onChange?.(value);
    },
    [setFieldValue, onChange],
  );

  useEffect(() => {
    setValue(get(values, name));
  }, [get(values, name)]);

  useEffect(() => {
    setDropDownOptions(options);
  }, [options]);

  return (
    <Form.Field width={width} error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>
        {toUpper(label)} &nbsp;
        {isExclamation && (
          <Icon color="red" name="exclamation circle" size="large" />
        )}
      </label>
      <Dropdown
        {...rest}
        fluid
        selection
        placeholder={placeholder}
        options={dropDownOptions}
        value={value}
        onChange={_onChange}
        onAddItem={_onAddItem}
      />
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export default InputDropdownSimple;
