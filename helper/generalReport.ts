import {
  ReportProgressTypeDataEnum,
  ReportProgressTypeEnum,
} from '../lib/enums/Report';

export const generalReportOptionsDropdown = [
  {
    key: `${ReportProgressTypeEnum.HUMAN_ASSET_VALUE}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Talent Mapping Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.HUMAN_ASSET_VALUE}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.FLIGHT_RISK}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Flight Risk Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.FLIGHT_RISK}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.TALENT_DEMOGRAPHY}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Talent Demography Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.TALENT_DEMOGRAPHY}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.TALENT_PRO_READINESS}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Talent Pro Readiness Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.TALENT_PRO_READINESS}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.TALENT_TURN_OVER_RATE}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Talent Turn Over Rate Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.TALENT_TURN_OVER_RATE}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.LEADERSHIP_ASSESSMENT}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Leadership Assessment Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.LEADERSHIP_ASSESSMENT}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.IDP_PROGRESS_REPORT}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `IDP Progress by Employee and Area of Focus Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.IDP_PROGRESS_REPORT}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.IDP_PROGRESS_SUMMARY}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `IDP Progress Summary Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.IDP_PROGRESS_SUMMARY}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.SUCCESS_PROFILE_EMP}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Success Profile by Employee Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.SUCCESS_PROFILE_EMP}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.SUCCESS_PROFILE_POS}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Success Profile by Position Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.SUCCESS_PROFILE_POS}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.IDP_LIST_APPROVER}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `IDP List Approver Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.IDP_LIST_APPROVER}.${ReportProgressTypeDataEnum.XLSX}`,
  },
];
