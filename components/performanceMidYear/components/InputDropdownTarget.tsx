import { FormikProps } from 'formik';
import { uniqBy } from 'lodash';
import React, { useMemo } from 'react';
import { PerfFormFillProps } from '../../../lib/data/perfMidYear/helpers/perfFormFill';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { PerfFormTypeItemProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import InputDropdownSimple from '../../InputDropdownSimple';

interface InputDropdownTargetPerfMidProps {
  formik: FormikProps<PerfEmpProps>;
  name: string;
  ruleTarget: PerfFormFillProps;
  ruleKPI: PerfFormFillProps;
  editable?: boolean;
  perfEmpItemKPI: PerfEmpItemPerKPIProps;
  formTypeItem: PerfFormTypeItemProps;
}

const InputDropdownTargetPerfMid = ({
  formik,
  name,
  ruleTarget,
  ruleKPI,
  editable,
  perfEmpItemKPI,
  formTypeItem,
}: InputDropdownTargetPerfMidProps) => {
  const optionsTarget = useMemo(() => {
    const isKPISelect = ruleKPI?.type === 'DROPDOWN' && !ruleKPI?.isHide;
    const { perfKPIId } = perfEmpItemKPI;
    const options: DropdownOptions[] = [];
    formTypeItem?.perfFormTypeTarget?.details?.forEach((detail) => {
      const { kpi, target } = detail;
      let isValid = false;
      if (isKPISelect && perfKPIId && kpi?.id === perfKPIId) {
        isValid = true;
      } else if (!perfKPIId || !isKPISelect) {
        isValid = true;
      }

      if (isValid && target) {
        options.push({
          key: target?.id,
          value: target?.id,
          text: target?.name,
        });
      }
    });
    return uniqBy(options, 'key');
  }, [perfEmpItemKPI, formTypeItem, ruleKPI]);

  return (
    <InputDropdownSimple
      formik={formik}
      name={`${name}.perfTargetId`}
      disabled={!(editable && ruleTarget?.isEditable)}
      placeholder={'Target'}
      label={''}
      className={`bg-disable-input`}
      options={optionsTarget}
      clearable
    />
  );
};

export default InputDropdownTargetPerfMid;
