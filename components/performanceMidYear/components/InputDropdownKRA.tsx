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

interface InputDropdownKRAPerfMidProps {
  formik: FormikProps<PerfEmpProps>;
  name: string;
  ruleKRA: PerfFormFillProps;
  ruleKPI: PerfFormFillProps;
  editable?: boolean;
  perfEmpItemKPI: PerfEmpItemPerKPIProps;
  formTypeItem: PerfFormTypeItemProps;
}

const InputDropdownKRAPerfMid = ({
  formik,
  name,
  ruleKRA,
  ruleKPI,
  editable,
  perfEmpItemKPI,
  formTypeItem,
}: InputDropdownKRAPerfMidProps) => {
  const optionsKRA = useMemo(() => {
    const isKPISelect = ruleKPI?.type === 'DROPDOWN' && !ruleKPI?.isHide;
    if (isKPISelect) {
      const { perfKPIId } = perfEmpItemKPI;
      const options: DropdownOptions[] = [];
      formTypeItem?.perfFormTypeKPI?.details?.forEach((detail) => {
        const { kra, kpi } = detail;
        let isValid = false;
        if (perfKPIId && kpi?.id === perfKPIId) {
          isValid = true;
        } else if (!perfKPIId) {
          isValid = true;
        }

        if (kra && isValid) {
          options.push({
            key: kra?.id,
            value: kra?.id,
            text: kra?.name,
          });
        }
      });
      return uniqBy(options, 'key');
    } else {
      const options =
        formTypeItem?.perfFormTypeKRA?.details?.map((detail) => {
          return {
            key: detail?.kra?.id,
            value: detail?.kra?.id,
            text: detail?.kra?.name,
          } as DropdownOptions;
        }) || [];
      return uniqBy(options, 'key');
    }
  }, [perfEmpItemKPI, formTypeItem, ruleKPI]);

  return (
    <InputDropdownSimple
      formik={formik}
      name={`${name}.perfKRAId`}
      disabled={!(editable && ruleKRA?.isEditable)}
      placeholder={'KRA'}
      label={''}
      className={`bg-disable-input`}
      options={optionsKRA}
      clearable
    />
  );
};

export default InputDropdownKRAPerfMid;
