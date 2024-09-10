// import { FormikProps } from 'formik';
import React from 'react';

type TogglesProps = {
  // formik: FormikProps<any>;
  disabled?: boolean;
  size?: 'large' | 'small';
  // onChangeCb?: (checked: boolean | undefined) => void;
  onClick?: () => void;
  // formik: FormikProps<any>;
  // name: string;
  checked?: boolean;
};

const Toggles = ({
  disabled,
  size,
  // onChangeCb,
  onClick,
  // formik: { values, setFieldValue },
  // name,
  checked,
}: TogglesProps) => {
  // const _onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
  //   (event: any) => {
  //     const { checked } = event.target;
  //     setFieldValue(name, checked);
  //     onChangeCb?.(checked);
  //   },
  //   [setFieldValue, values, name, onChangeCb],
  // );

  // const checked = useMemo(() => {
  //   const value = get(values, name);
  //   if (isString(value)) return value === 'true';
  //   else if (isBoolean(value)) return value;
  //   else return false;
  // }, [name, values]);

  switch (size) {
    case 'large':
      return (
        <label className="rvswitch">
          <input
            className="rvsliders"
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onClick={onClick}
          />
          <span className="rvbuttonslider round"></span>
          <span className="labels"></span>
        </label>
      );

    case 'small':
      return (
        <label className="rvswitch small">
          <input
            className="rvsliders small"
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onClick={onClick}
          />
          <span className="rvbuttonslider round small"></span>
          <span className="labels"></span>
        </label>
      );

    default:
      return (
        <label className="rvswitch">
          <input
            className="rvsliders"
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onClick={onClick}
          />
          <span className="rvbuttonslider round"></span>
          <span className="labels"></span>
        </label>
      );
  }
};

export default Toggles;
