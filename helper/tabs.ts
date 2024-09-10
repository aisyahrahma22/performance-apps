import { SemanticICONS } from 'semantic-ui-react';

type TabsItem = {
  name: string;
  icon?: SemanticICONS;
  key: string;
  actions: string[];
};

const TABS: { [key: string]: TabsItem } = {
  employeeProfilePerformance: {
    name: 'Performance',
    icon: 'tachometer alternate',
    key: 'employeeProfilePerformance',
    actions: [
      'EMP_PERFORMANCE_LIST',
      'EMP_PERFORMANCE_UPLOAD',
      'EMP_PERFORMANCE_UPLOAD_DETAIL',
      'EMP_PERFORMANCE_UPLOAD_PROGRESS_LIST',
    ],
  },
  userInquiry: {
    name: 'User Inquiry',
    icon: 'users',
    key: 'userInquiry',
    actions: [
      'USER_VIEW_BASIC',
      'USER_VIEW_ROLES',
      'USER_RESET_PASSWORD',
      'USER_DELETE',
      'USER_LIST_VIEW',
    ],
  },
  userAccess: {
    name: 'User Access',
    icon: 'key',
    key: 'userAccess',
    actions: [
      'USER_ACCESS_VIEW',
      'USER_ACCESS_VIEW_RIGHTS',
      'USER_ACCESS_EDIT',
      'USER_ACCESS_EDIT_RIGHTS',
      'USER_ACCESS_DELETE',
      'USER_ACCESS_LIST_VIEW',
    ],
  },
  masterDataPerformanceMeasurement: {
    name: 'Measurement Performance Form',
    icon: 'universal access',
    key: 'masterDataPerformanceMeasurement',
    actions: [
      'MD_PERFORMANCE_FORM_MEASUREMENT_LIST_VIEW',
      'MD_PERFORMANCE_FORM_MEASUREMENT_VIEW',
      'MD_PERFORMANCE_FORM_MEASUREMENT_CREATE',
      'MD_PERFORMANCE_FORM_MEASUREMENT_EDIT',
      'MD_PERFORMANCE_FORM_MEASUREMENT_UPLOAD',
      'MD_PERFORMANCE_FORM_MEASUREMENT_UPLOAD_PROGRESS_LIST',
      'MD_PERFORMANCE_FORM_MEASUREMENT_UPLOAD_DETAIL',
      'MD_PERFORMANCE_FORM_MEASUREMENT_UPLOAD_PROGRESS_LIST_DETAIL',
      'MD_PERF_FORM_MEASUREMENT_DELETE',
    ],
  },
  masterDataPerformanceFormType: {
    name: 'Performance Form Type',
    icon: 'universal access',
    key: 'masterDataPerformanceFormType',
    actions: [
      'MD_PERFORMANCE_FORM_TYPE_LIST_VIEW',
      'MD_PERFORMANCE_FORM_TYPE_VIEW',
      'MD_PERFORMANCE_FORM_TYPE_CREATE',
      'MD_PERFORMANCE_FORM_TYPE_EDIT',
      'MD_PERFORMANCE_FORM_TYPE_UPLOAD',
      'MD_PERFORMANCE_FORM_TYPE_UPLOAD_PROGRESS_LIST',
      'MD_PERFORMANCE_FORM_TYPE_DELETE',
    ],
  },
  masterDataPerformanceFinalResult: {
    name: 'Final Result',
    icon: 'universal access',
    key: 'masterDataPerformanceFinalResult',
    actions: [
      'MD_PERF_MEASUREMENT_FINAL_RESULT_LIST_VIEW',
      'MD_PERF_MEASUREMENT_FINAL_RESULT_VIEW',
      'MD_PERF_MEASUREMENT_FINAL_RESULT_CREATE',
      'MD_PERF_MEASUREMENT_FINAL_RESULT_EDIT',
      'MD_PERF_MEASURE_FINAL_UPLOAD',
      'MD_PERF_MEASURE_FINAL_UPLOADS',
      'MD_PERF_MEASUREMENT_FINAL_RESULT_UPLOAD_PROGRESS_LIST_DETAIL',
      'MD_PERF_MEASUREMENT_FINAL_RESULT_UPLOAD_PROGRESS_LIST_DETAIL',
      'MD_PERF_MEASUREMENT_FINAL_RESULT_DELETE',
    ],
  },
  configurationPerformanceWorkflowPosition: {
    name: 'Performance Superior Position',
    icon: 'stack overflow',
    key: 'configurationPerformanceWorkflowPosition',
    actions: [
      'PERF_WORKFLOW_PST_LIST_VIEW',
      'PERF_WORKFLOW_PST_VIEW',
      'PERF_WORKFLOW_PST_EDIT',
      'PERF_WORKFLOW_PST_UPLOAD',
      'PERF_WORKFLOW_PST_UPLOAD_PROGRESS_LIST',
    ],
  },
  configurationPerformanceWorkflowEmployee: {
    name: 'Performance Superior Employee',
    icon: 'stack overflow',
    key: 'configurationPerformanceWorkflowEmployee',
    actions: [
      'PERF_WORKFLOW_EMP_LIST_VIEW',
      'PERF_WORKFLOW_EMP_VIEW',
      'PERF_WORKFLOW_EMP_CREATE',
      'PERF_WORKFLOW_EMP_EDIT',
      'PERF_WORKFLOW_EMP_UPLOAD',
      'PERF_WORKFLOW_EMP_UPLOAD_PROGRESS_LIST',
    ],
  },
  syncPerformanceWorkflow: {
    name: 'Sync Workflow to Performance Form',
    icon: 'refresh',
    key: 'syncPerformanceWorkflow',
    actions: [
      'PERF_WORKFLOW_EMP_LIST_VIEW',
      'PERF_WORKFLOW_EMP_VIEW',
      'PERF_WORKFLOW_EMP_CREATE',
      'PERF_WORKFLOW_EMP_EDIT',
      'PERF_WORKFLOW_EMP_UPLOAD',
      'PERF_WORKFLOW_EMP_UPLOAD_PROGRESS_LIST',
    ],
  },
  masterDataPerformanceType: {
    name: 'Performance Type',
    icon: 'chart line',
    key: 'PerformanceType',
    actions: [
      'MD_PERFTYP_LIST_VIEW',
      'MD_PERFTYP_VIEW',
      'MD_PERFTYP_CREATE',
      'MD_PERFTYP_EDIT',
      'MD_PERFTYP_DELETE',
      'MD_PERFTYP_UPLOAD',
      'MD_PERFTYP_UPLOAD_PROGRESS_LIST',
    ],
  },
  masterDataPerformanceCategory: {
    name: 'Category',
    icon: 'th large',
    key: 'Category',
    actions: [
      'MD_PERFCATEGORY_LIST_VIEW',
      'MD_PERFCATEGORY_VIEW',
      'MD_PERFCATEGORY_CREATE',
      'MD_PERFCATEGORY_EDIT',
      'MD_PERFCATEGORY_DELETE',
      'MD_PERFCATEGORY_UPLOAD',
      'MD_PERFCATEGORY_UPLOAD_PROGRESS_LIST',
    ],
  },
  masterDataPerformanceKRA: {
    name: 'KRA',
    icon: 'table',
    key: 'KRA',
    actions: [
      'MD_PERFKRA_LIST_VIEW',
      'MD_PERFKRA_VIEW',
      'MD_PERFKRA_CREATE',
      'MD_PERFKRA_EDIT',
      'MD_PERFKRA_DELETE',
      'MD_PERFKRA_UPLOAD',
      'MD_PERFKRA_UPLOAD_PROGRESS_LIST',
    ],
  },
  masterDataPerformanceKPI: {
    name: 'KPI',
    icon: 'th list',
    key: 'KPI',
    actions: [
      'MD_PERFKPI_LIST_VIEW',
      'MD_PERFKPI_VIEW',
      'MD_PERFKPI_CREATE',
      'MD_PERFKPI_EDIT',
      'MD_PERFKPI_DELETE',
      'MD_PERFKPI_UPLOAD',
      'MD_PERFKPI_UPLOAD_PROGRESS_LIST',
    ],
  },
  masterDataPerformanceTarget: {
    name: 'Target',
    icon: 'target',
    key: 'Target',
    actions: [
      'MD_PERFTARGET_LIST_VIEW',
      'MD_PERFTARGET_VIEW',
      'MD_PERFTARGET_CREATE',
      'MD_PERFTARGET_EDIT',
      'MD_PERFTARGET_DELETE',
      'MD_PERFTARGET_UPLOAD',
      'MD_PERFTARGET_UPLOAD_PROGRESS_LIST',
    ],
  },
  performanceReport: {
    name: 'Performance Report',
    icon: 'file alternate outline',
    key: 'performanceReport',
    actions: ['PERFORMANCE_REPORT_DOWNLOAD'],
  },
};

export default TABS;
