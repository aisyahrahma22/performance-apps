import React, { useCallback, useMemo } from 'react';
import { Form, Checkbox, CheckboxProps } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, isBoolean, isString } from 'lodash';

type InputCheckboxProps = {
  formik: FormikProps<any>;
  name: string;
} & CheckboxProps;

const InputCheckbox2 = ({
  formik: { errors, touched, values, setFieldValue },
  name,
  ...rest
}: InputCheckboxProps) => {
  const onChange = useCallback(
    (_e, { checked }) => {
      setFieldValue(name, checked);
    },
    [setFieldValue, name],
  );

  const checked = useMemo(() => {
    const value = get(values, name);
    if (isString(value)) return value === 'true';
    else if (isBoolean(value)) return value;
    else return false;
  }, [name, values]);
  return (
    <Form.Field error={touched[name] && errors[name]}>
      <Checkbox
        {...rest}
        checked={checked}
        fitted
        name={name}
        onChange={onChange}
      />
    </Form.Field>
  );
};

export default InputCheckbox2;
