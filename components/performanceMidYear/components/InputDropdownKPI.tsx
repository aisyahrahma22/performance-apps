import { FormikProps } from 'formik';
import { find, get, uniqBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { PerfFormFillProps } from '../../../lib/data/perfMidYear/helpers/perfFormFill';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { PerfFormTypeItemProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import InputDropdownSimple from '../../InputDropdownSimple';

interface InputDropdownKPIPerfMidProps {
  formik: FormikProps<PerfEmpProps>;
  name: string;
  ruleKPI: PerfFormFillProps;
  ruleKRA: PerfFormFillProps;
  ruleTarget: PerfFormFillProps;
  editable?: boolean;
  perfEmpItemKPI: PerfEmpItemPerKPIProps;
  formTypeItem: PerfFormTypeItemProps;
}

const InputDropdownKPIPerfMid = ({
  formik,
  name,
  ruleKPI,
  ruleKRA,
  ruleTarget,
  editable,
  perfEmpItemKPI,
  formTypeItem,
}: InputDropdownKPIPerfMidProps) => {
  const optionsKPI = useMemo(() => {
    const currSelected = get(formik.values, `${name}.perfKPIId`);
    const isKRASelect = ruleKRA?.type === 'DROPDOWN' && !ruleKRA.isHide;
    const isTargetSelect =
      ruleTarget?.type === 'DROPDOWN' && !ruleTarget.isHide;
    const { perfKRAId, perfTargetId } = perfEmpItemKPI;
    const options: DropdownOptions[] = [];
    formTypeItem?.perfFormTypeKPI?.details?.forEach((detail) => {
      const { kra, kpi } = detail;
      let isValid = false;
      if (perfKRAId && isKRASelect && kra?.id === perfKRAId) {
        isValid = true;
      } else if (!perfKRAId) {
        isValid = true;
      }

      if (perfTargetId && isTargetSelect && !currSelected) {
        // Because 1 KPI only 1 Target, so if curr empty and target selected, so just kpi with relation show in options
        const findTarget = find(
          formTypeItem?.perfFormTypeTarget?.details,
          (det) => det?.kpi?.id === kpi?.id && det?.target?.id === perfTargetId,
        );
        if (!findTarget) {
          isValid = false;
        }
      }

      if (kpi && isValid) {
        options.push({
          key: kpi?.id,
          value: kpi?.id,
          text: kpi?.name,
        });
      }
    });
    return uniqBy(options, 'key');
  }, [perfEmpItemKPI, formTypeItem, ruleKRA, ruleTarget, formik, name]);

  const onChange = useCallback(
    (value) => {
      if (value) {
        const targetDetail = find(
          formTypeItem?.perfFormTypeTarget?.details,
          (det) => det?.kpi?.id === value,
        );
        formik.setFieldValue(`${name}.perfKPIId`, value);
        if (ruleTarget.type === 'DROPDOWN' && !ruleTarget.isHide) {
          formik.setFieldValue(
            `${name}.perfTargetId`,
            targetDetail?.target?.id || '',
          );
        } else {
          formik.setFieldValue(
            `${name}.target`,
            targetDetail?.target?.name || '',
          );
        }
      } else {
        formik.setFieldValue(`${name}.perfKPIId`, '');
        if (ruleTarget.type === 'DROPDOWN' && !ruleTarget.isHide) {
          formik.setFieldValue(`${name}.perfTargetId`, '');
        } else {
          formik.setFieldValue(`${name}.target`, '');
        }
      }
    },
    [formik, ruleTarget, formTypeItem, name],
  );

  return (
    <InputDropdownSimple
      formik={formik}
      name={`${name}.perfKPIId`}
      disabled={!(editable && ruleKPI?.isEditable)}
      placeholder={'KPI'}
      label={''}
      className={`bg-disable-input`}
      options={optionsKPI}
      clearable
      onChange={onChange}
    />
  );
};

export default InputDropdownKPIPerfMid;
