import React, { useCallback, useMemo } from 'react';
import { Form, Checkbox, CheckboxProps } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, isBoolean, isString, toUpper } from 'lodash';

type InputCheckboxProps = {
  formik: FormikProps<any>;
  label?: string;
  name: string;
  onChangeCb?: (checked: boolean | undefined) => void;
  toggle?: boolean;
  fitted?: boolean;
} & CheckboxProps;

const InputCheckbox = ({
  formik: { errors, touched, values, setFieldValue },
  label,
  name,
  onChangeCb,
  toggle = true,
  fitted = true,
  ...rest
}: InputCheckboxProps) => {
  const _onChange = useCallback(
    (_e, { checked }: CheckboxProps) => {
      setFieldValue(name, checked);
      onChangeCb?.(checked);
    },
    [setFieldValue, name, onChangeCb],
  );

  const checked = useMemo(() => {
    const value = get(values, name);
    if (isString(value)) return value === 'true';
    else if (isBoolean(value)) return value;
    else return false;
  }, [name, values]);
  return (
    <Form.Field error={touched[name] && errors[name]}>
      {label ? <label htmlFor={name}>{toUpper(label)}</label> : <br />}
      <Checkbox
        {...rest}
        checked={checked}
        toggle={toggle}
        fitted={fitted}
        name={name}
        onChange={_onChange}
      />
      <label className={'error'}>{errors[name]}</label>
    </Form.Field>
  );
};

export default InputCheckbox;
