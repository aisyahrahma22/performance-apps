import React, { useCallback, useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get, toUpper } from 'lodash';
import { DateInput } from 'semantic-ui-calendar-react';
import { format } from 'date-fns';

type InputProps = {
  placeholder: string;
  label: string;
  formik: FormikProps<any>;
  name: string;
  disableMinute?: boolean;
  onChange?: any;
  dateOnly?: boolean;
  disabled?: boolean;
  minDate?: Date;
  dateFormat?: string;
  isPreventEnter?: boolean;
};

export const dateStringFormat = 'dd-MM-yyyy';
export const dateStringTimeFormat = 'dd-MM-yyyy HH:mm';

export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

const DatePickerRange = ({
  label,
  formik: { errors, touched, setFieldValue, values },
  name,
  placeholder,
  dateOnly = false,
  disabled = false,
  minDate,
  dateFormat,
  isPreventEnter = false,
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
      <div style={{ flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
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
        </div>
        <text> to </text>
        <div>
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
        </div>
      </div>
      <label className={'error'}>{get(errors, name)}</label>
    </Form.Field>
  );
};

export default DatePickerRange;
