import React, { useCallback, useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, toUpper } from 'lodash';
import {
  DateInput,
  DateTimeInput,
  TimeInput,
  YearInput,
} from 'semantic-ui-calendar-react';
import { format } from 'date-fns';

type InputProps = {
  placeholder: string;
  label: string;
  formik: FormikProps<any>;
  name: string;
  disableMinute?: boolean;
  onChange?: any;
  dateOnly?: boolean;
  yearOnly?: boolean;
  disabled?: boolean;
  minDate?: Date;
  dateFormat?: string;
  isPreventEnter?: boolean;
  timeOnly?: boolean;
};

export const dateStringFormat = 'dd-MM-yyyy';
export const dateStringTimeFormat = 'dd-MM-yyyy HH:mm';

export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

const DatePicker = ({
  label,
  formik: { errors, touched, setFieldValue, values },
  name,
  placeholder,
  disableMinute = false,
  dateOnly = false,
  yearOnly = false,
  disabled = false,
  minDate,
  dateFormat,
  isPreventEnter = false,
  timeOnly = false,
}: InputProps) => {
  const value = useMemo(() => {
    const dateFormat = dateOnly ? dateStringFormat : dateStringTimeFormat;
    const curValue = get(values, name);
    if (isIsoDate(curValue)) {
      return format(new Date(curValue), dateFormat);
    } else return curValue;
  }, [values, dateOnly, name]);

  const preventEnter = useCallback((e) => {
    if (['Enter'].includes(e?.key)) {
      e?.preventDefault();
    }
  }, []);

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{toUpper(label)}</label>
      {dateOnly ? (
        <DateInput
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          iconPosition="right"
          onChange={(_e, { name, value }) => setFieldValue(name, value)}
          closable
          minDate={minDate ?? ''}
          dateFormat={dateFormat ?? 'DD-MM-YYYY'}
          onKeyPress={isPreventEnter ? preventEnter : undefined}
          initialDate={minDate ?? ''}
        />
      ) : yearOnly ? (
        <YearInput
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          iconPosition="right"
          onChange={(_e, { name, value }) => setFieldValue(name, value)}
          closable
          minDate={minDate ?? ''}
          dateFormat={dateFormat ?? 'YYYY'}
          onKeyPress={isPreventEnter ? preventEnter : undefined}
          initialDate={minDate ?? ''}
        />
      ) : (
        <>
          {timeOnly ? (
            <TimeInput
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              iconPosition="right"
              onChange={(_e, { name, value }) => setFieldValue(name, value)}
              closable
              disableMinute={disableMinute}
              // minDate={minDate ?? ''}
              onKeyPress={isPreventEnter ? preventEnter : undefined}
              // initialDate={minDate ?? ''}
            />
          ) : (
            <DateTimeInput
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              iconPosition="right"
              onChange={(_e, { name, value }) => setFieldValue(name, value)}
              closable
              disableMinute={disableMinute}
              minDate={minDate ?? ''}
              onKeyPress={isPreventEnter ? preventEnter : undefined}
              initialDate={minDate ?? ''}
            />
          )}
        </>
      )}
      <small className={'error'}>{get(errors, name)}</small>
    </Form.Field>
  );
};

export default DatePicker;
