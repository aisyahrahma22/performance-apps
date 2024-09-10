import { get } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Checkbox } from 'semantic-ui-react';
import getGuid from '../../../lib/util/getGuid';

interface CheckboxScoreProps {
  score: number;
  formik: any;
  idx: number;
  siloamValueId: string;
  name: string;
  formikName: any;
  isDetail: boolean;
  level?: string;
  perfEmployeeId?: string;
  perfSuperiorId?: string;
  disabled?: boolean;
}

const CheckboxScore = ({
  score,
  formik,
  name,
  formikName,
  idx,
  siloamValueId,
  isDetail,
  level,
  perfEmployeeId = '',
  perfSuperiorId = '',
  disabled,
}: CheckboxScoreProps) => {
  const onChange = useCallback(
    (val) => {
      const existingItem = get(formik.values, name)?.find(
        (item: any) => item.siloamValueId === siloamValueId,
      );
      const newData = {
        id: existingItem ? existingItem.id : getGuid(),
        score: val,
        order: idx,
        siloamValueId,
        type: level,
        perfEmployeeId,
        perfSuperiorId,
      };

      // Remove existing item and add new one
      const items = get(formik.values, name) || [];
      const updatedItems = items.filter((item: any) => item !== existingItem);
      updatedItems.push(newData);

      formik.setFieldValue(name, updatedItems);
    },
    [formik, idx, name, siloamValueId],
  );

  const isChecked = useMemo(() => {
    const findVal = get(formik.values, name)?.find(
      (val: any) => val.siloamValueId === siloamValueId && val.score === score,
    );

    return (
      !!findVal ||
      (formikName[idx]?.score === score &&
        formikName[idx]?.siloamValueId === siloamValueId)
    );
  }, [formikName, formik, idx, score, siloamValueId]);

  return (
    <Checkbox
      value={score}
      checked={isChecked}
      onChange={(_e, data) => onChange(data.value)}
      readOnly={isDetail}
      disabled={disabled}
    />
  );
};

export default CheckboxScore;
