import React, { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Input as SURInput,
  InputProps as SURInputProps,
  TextArea,
  Select,
  Icon,
} from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import { FormikProps } from 'formik';
import { get, replace, round, toNumber } from 'lodash';
import { renderNumber, splitCurrency } from '../../../lib/util/renderNumber';
import { SemanticWIDTHS } from 'semantic-ui-react/src/generic';

// const regex = /[^\w\s]/gi;
// const regex = /^[!@#$%^*+=[]{};'"\\|.<>\/?]*$/; //this regex doesn't work
// #!@$%^&*(-_+=[]{}\\|:;\"’,/?

type Options = {
  key: string;
  text: string;
  value: string;
};

type InputProps = {
  placeholder: string;
  formik: FormikProps<any>;
  name: string;
  label?: string;
  labelProps?: any;
  onChange?: (value: any) => void;
  input?: Node;
  rows?: number | string;
  initialOptions?: Options[];
  isNumber?: boolean;
  isRound?: boolean;
  hideError?: boolean;
  onKeyPressProps?: any;
  isPreventEnter?: boolean;
  isRequired?: boolean;
  max?: number;
  min?: number;
  isTextAreaAutoHigh?: boolean;
  width?: SemanticWIDTHS;
  isExclamation?: boolean;
  required?: boolean;
} & SURInputProps;

const Inputs = ({
  label,
  formik: { errors, touched, setFieldValue, values, handleBlur },
  name,
  labelProps,
  placeholder,
  input,
  select,
  textarea,
  options,
  rows,
  type,
  width,
  onChange,
  isNumber = false,
  isRound = false,
  hideError = false,
  onKeyPressProps,
  isPreventEnter = false,
  isRequired = false,
  max,
  min,
  isTextAreaAutoHigh = false,
  isExclamation,
  // initialOptions = [],
  onKeyDown,
  required = false,
  ...rest
}: InputProps) => {
  const [value, setValue] = useState<any>('');
  const [errorValidate, setErrorValidate] = useState<boolean>(false);

  const _onChange = useCallback(
    (_e, { name, value }) => {
      let preventChange = false;
      if (isNumber && value) value = toNumber(value);
      if ((max !== undefined || min !== undefined) && isNumber) {
        let isError = false;
        if (value || value === 0) {
          if (min !== undefined && value < min) {
            isError = true;
          }
          if (max !== undefined && value > max) {
            isError = true;
          }
        }

        if (!isError) {
          setErrorValidate(false);
          setValue(value);
          setFieldValue(name, value);
        } else preventChange = true;
      } else if (type == 'currency') {
        setErrorValidate(false);
        setValue(renderNumber(value));
        setFieldValue(name, splitCurrency(value));
      } else {
        setErrorValidate(false);
        setValue(value);
        setFieldValue(name, value);
      }

      if (!preventChange) {
        onChange?.(value);
      }
    },
    [isNumber, type, onChange, setFieldValue, max, min],
  );

  const _onChangeAutoHeight = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e?.target;
      _onChange(e, { name, value });
    },
    [name, _onChange],
  );

  const _onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLImageElement>) => {
      // validateSpecialChar(e);
      onKeyDown?.(e);
    },
    [onKeyDown],
  );

  useEffect(() => {
    let value = get(values, name);
    if (type == 'currency') {
      value = replace(value, /\D/g, '') || value;
      setValue(renderNumber(value));
    } else {
      setValue(value);
    }
  }, [name, type, values]);

  const onlyNumbers = (e: any) => {
    if (!/[0-9.,]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const preventEnter = useCallback((e) => {
    if (['Enter'].includes(e?.key)) {
      e.preventDefault();
    }
  }, []);

  // const validateSpecialChar = useCallback(
  //   (e: React.KeyboardEvent<HTMLImageElement>) => {
  //     if (regex.test(e.key)) {
  //       setErrorValidate(true);
  //       e.preventDefault();
  //     }
  //   },
  //   [],
  // );

  // const validatePaste = useCallback(
  //   (e: React.ClipboardEvent<HTMLInputElement>) => {
  //     const str = e.clipboardData.getData('Text');
  //     const newStr = str.replace(regex, '');
  //     if (str !== newStr) {
  //       setErrorValidate(true);
  //       e.preventDefault();
  //     }
  //   },
  //   [],
  // );

  return (
    <Form.Field width={width} error={get(touched, name) && get(errors, name)}>
      <div className="rvflexs row start">
        <span className="rvtexts semibold text-xs">{label}</span>
        {isRequired ||
          (required && (
            <span className="rvtext semibold text-xs rvcolors color-error-500">
              *
            </span>
          ))}
        {isExclamation && (
          <Icon color="red" name="exclamation circle" size="large" />
        )}
      </div>
      {input}
      {!input && !select && !textarea && (
        <SURInput
          {...rest}
          fluid
          label={labelProps}
          type={type}
          placeholder={
            errorValidate ? 'Improper Input Validation' : placeholder
          }
          name={name}
          onChange={_onChange}
          value={isRound ? round(value, 2) : value}
          onKeyPress={
            isNumber
              ? onlyNumbers
              : isPreventEnter
              ? preventEnter
              : onKeyPressProps || undefined
          }
          onKeyDown={_onKeyDown}
          // onPaste={validatePaste}
          className={errorValidate ? 'error-shake' : ''}
          onBlur={handleBlur}
        />
      )}
      {!input && select && (
        <Select
          {...rest}
          fluid
          placeholder={placeholder}
          name={name}
          type={type}
          onChange={_onChange}
          options={options}
          value={value}
        />
      )}
      {!input &&
        !select &&
        textarea &&
        (isTextAreaAutoHigh ? (
          <TextareaAutosize
            {...(rest as any)}
            placeholder={placeholder}
            name={name}
            onChange={_onChangeAutoHeight}
            onKeyDown={_onKeyDown}
            value={isRound ? round(value, 2) : value}
            minRows={rows as number}
          />
        ) : (
          <TextArea
            {...rest}
            placeholder={
              errorValidate ? 'Improper Input Validation' : placeholder
            }
            name={name}
            type={type}
            onChange={_onChange}
            value={isRound ? round(value, 2) : value}
            rows={rows}
            // onKeyDown={_onKeyDown}
            // onPaste={validatePaste}
            className={errorValidate ? 'error-shake' : ''}
          />
        ))}
      {!hideError && get(touched, name) && get(errors, name) && (
        <div className="rvflexs row start center" style={{ marginTop: '4px' }}>
          <span
            className="material-icons-outlined rvcolors color-error-600"
            style={{ fontSize: '16px', marginRight: '4px' }}
          >
            report
          </span>
          <span className="rvcolors color-error-600 rvtexts regular text-xs">
            {get(errors, name)}
          </span>
        </div>
      )}
    </Form.Field>
  );
};

export default Inputs;
