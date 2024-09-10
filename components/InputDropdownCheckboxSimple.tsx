import React, { useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, remove } from 'lodash';

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

type InputDropdownCheckboxProps = {
  name: string;
  formik: FormikProps<any> | FormikCustom;
  initialOptions: Options[];
  onChange?: any;
  className?: string;
} & DropdownProps;

const InputDropdownCheckboxSimple = ({
  formik: { errors, touched, values, setFieldValue },
  name,
  onChange,
  className = '',
  initialOptions,
  placeholder = '',
  ...rest
}: InputDropdownCheckboxProps) => {
  // const [value, setValue] = useState([]);
  const [options] = useState<Options[]>([]);

  const _onChange = useCallback(
    (_e, { value: newValue }) => {
      const findVal = get(values, name)?.find((val: any) => val === newValue);
      if (findVal) {
        const newItems = [...get(values, name)];
        remove(newItems, (i) => i === newValue);
        setFieldValue(name, newItems);
      } else {
        const newItems = [...get(values, name), newValue];
        setFieldValue(name, newItems);
      }
    },
    [get(values, name)],
  );

  useEffect(() => {
    const valueArr = options.map((option) => option.value);
    setFieldValue(name, valueArr);
  }, [options]);

  const checkOption = (option: Options) => {
    const findOpt = get(values, name)?.find((val: any) => val === option.value);
    return findOpt;
  };

  const _onClear = useCallback(() => {
    setFieldValue(name, []);
    onChange?.([]);
  }, [setFieldValue]);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <Dropdown
        {...rest}
        selection
        labeled
        className={`icon ${className}`}
        search
        direction="left"
        placeholder={placeholder}
      >
        <Dropdown.Menu>
          {/* <Dropdown.Menu scrolling>
            {initialOptions.map((option) => (
              <Dropdown.Item
                {...option}
                key={option.key}
                icon={checkOption(option) ? 'check square' : 'square outline'}
                onClick={_onChange}
              />
            ))}
          </Dropdown.Menu> */}
          {initialOptions.map((option) => (
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

export default InputDropdownCheckboxSimple;
