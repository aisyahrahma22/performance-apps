import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Slider, { SliderProps } from 'rc-slider';
import { FormikProps } from 'formik';
import { forEach, get, toUpper } from 'lodash';
import { Form } from 'semantic-ui-react';

export type LabelMark = {
  value: number;
  title: string;
  description: string;
};

type InputRangeProps = {
  label: string;
  formik: FormikProps<any>;
  name: string;
  min: number;
  max: number;
  style?: React.CSSProperties;
  labelMarks?: LabelMark[];
  styleMarks?: React.CSSProperties;
  hideError?: boolean;
} & SliderProps;

const InputRange = ({
  label,
  formik: { setFieldValue, values, errors, touched },
  name,
  min,
  max,
  style,
  labelMarks,
  styleMarks,
  hideError = false,
  ...rest
}: InputRangeProps) => {
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    const currVal = get(values, name);
    setValue(currVal);
  }, [get(values, name)]);

  const customMarks = useMemo(() => {
    const res: any = {};
    forEach(labelMarks, (label) => {
      res[label.value] = {
        label: <LabelMarks {...label} />,
        style: styleMarks,
      };
    });
    return res;
  }, [labelMarks, styleMarks]);

  const _onChange = useCallback(
    (val) => {
      setFieldValue(name, val);
      setValue(val);
    },
    [setFieldValue, setValue],
  );

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{toUpper(label)}</label>
      <div style={{ height: '75px', ...style }}>
        <Slider
          {...rest}
          min={min}
          max={max}
          value={value}
          marks={customMarks}
          onChange={_onChange}
          trackStyle={{ backgroundColor: '#00B5AD' }}
          activeDotStyle={{
            backgroundColor: '#00B5AD',
            borderColor: '#00B5AD',
          }}
        />
      </div>
      {!hideError && (
        <div
          style={{
            fontSize: '0.7em',
            textAlign: 'right',
            color: 'red',
            fontStyle: 'italic',
          }}
        >
          {get(errors, name)}
        </div>
      )}
    </Form.Field>
  );
};

export const LabelMarks = ({ title, description }: any) => {
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
    </div>
  );
};

export default InputRange;
