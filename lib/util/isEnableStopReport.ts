const enabledTypes = [
  'PERF_MONITORING',
  'PERF_APPROVER_PA',
  'PERF_FINAL_EVAL',
  'PERF_KPI_SCORE',
  'PA_FORM_BY_EMP',
];

export const isEnableStopReport = (reportType: string) => {
  return enabledTypes.includes(reportType);
};
