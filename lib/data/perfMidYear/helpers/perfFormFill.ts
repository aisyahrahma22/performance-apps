import { find } from 'lodash';
import {
  PerfFormTypeItemProps,
  PerfFormTypeProps,
} from '../interfaces/perfForm.interface';

type PerfFormFillRuleProps = {
  formType: PerfFormTypeProps;
  formTypeItem: PerfFormTypeItemProps;
};

export type PerfFormFillProps = {
  type: FormFillType;
  isEditable?: boolean;
  isUserDefine?: boolean;
  isHide: boolean;
  isPredefine?: boolean;
};

export type FormFillType = 'DROPDOWN' | 'TEXT_AREA';

export const perfFormFillRule = ({
  formType,
  formTypeItem,
}: PerfFormFillRuleProps) => {
  const { perfFormTypeKRA, perfFormTypeKPI, perfFormTypeTarget } = formTypeItem;

  const isPredefineKPI =
    !perfFormTypeKPI?.isUserDefine && !perfFormTypeKPI?.isSelection; // editable or not ?
  const isPredefineKRA = isPredefineKPI
    ? isPredefineKPI
    : !!find(perfFormTypeKRA?.details, (det) => det?.isPredefine);

  const kra: PerfFormFillProps = {
    type: perfFormTypeKRA?.isSelection ? 'DROPDOWN' : 'TEXT_AREA',
    isEditable: perfFormTypeKRA?.isEditable,
    isUserDefine: perfFormTypeKRA?.isUserDefine,
    isHide: !formType?.isKRA,
    isPredefine: isPredefineKRA,
  };

  const kpi: PerfFormFillProps = {
    type: perfFormTypeKPI?.isSelection ? 'DROPDOWN' : 'TEXT_AREA',
    isEditable: perfFormTypeKPI?.isEditable,
    isUserDefine: perfFormTypeKRA?.isUserDefine,
    isHide: false,
    isPredefine: isPredefineKPI,
  };

  const target: PerfFormFillProps = {
    type: 'TEXT_AREA',
    // type: perfFormTypeTarget?.isUserDefine || kpi.type === 'TEXT_AREA' ? 'TEXT_AREA' : 'DROPDOWN',
    isEditable: perfFormTypeTarget?.isEditable,
    isUserDefine: perfFormTypeTarget?.isUserDefine,
    isHide: !formType?.isTarget,
  };

  return {
    kra,
    kpi,
    target,
  };
};
