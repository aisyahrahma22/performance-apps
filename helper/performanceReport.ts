import {
  ReportProgressTypeDataEnum,
  ReportProgressTypeEnum,
} from '../lib/enums/Report';

export const performanceReportOptionsDropdown = [
  {
    key: `${ReportProgressTypeEnum.PERF_MONITORING}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Report Monitoring [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.PERF_MONITORING}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.PERF_APPROVER_PA}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Report List Approver PA [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.PERF_APPROVER_PA}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.PERF_KPI_SCORE}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `KPI & Score Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.PERF_KPI_SCORE}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.PERF_FINAL_EVAL}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `Final Evaluation Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.PERF_FINAL_EVAL}.${ReportProgressTypeDataEnum.XLSX}`,
  },
  {
    key: `${ReportProgressTypeEnum.PA_FORM_BY_EMP}.${ReportProgressTypeDataEnum.XLSX}`,
    text: `PA Form by Emp Report [${ReportProgressTypeDataEnum.XLSX}]`,
    value: `${ReportProgressTypeEnum.PA_FORM_BY_EMP}.${ReportProgressTypeDataEnum.XLSX}`,
  },
];
