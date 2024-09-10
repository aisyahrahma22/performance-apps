import React, { useCallback, useState } from 'react';
import { Checkbox, CheckboxProps } from 'semantic-ui-react';

type CheckboxStandartProps = {
  name: string;
  check: boolean;
  onChange?: any;
  disabled?: boolean;
} & CheckboxProps;

const CheckboxStandart = ({
  name,
  check,
  onChange,
  disabled,
  ...rest
}: CheckboxStandartProps) => {
  const [checkValue, setCheckValue] = useState<any>(check);
  const _onClick = useCallback(
    (_e, { checked }) => {
      setCheckValue(checked);
      onChange?.(checked);
    },
    [check],
  );

  return (
    <Checkbox
      disabled={disabled}
      toggle
      fitted
      checked={checkValue}
      name={name}
      onClick={!disabled ? _onClick : () => undefined}
      {...rest}
    />
  );
};

export default CheckboxStandart;
