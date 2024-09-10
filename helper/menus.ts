const MAIN_MENU = [
  {
    code: 'HOME',
    name: 'Home',
    icon: '/icons-revamp/home.jpeg',
    iconActive: '/icons-revamp/home.jpeg',
    pathname: '/home',
    submenu: [],
  },
  {
    code: 'PERFORMANCE',
    name: 'Performance Evaluation',
    icon: '/icons-revamp/performance.jpeg',
    iconActive: '/icons-revamp/performance.jpeg',
    pathname: '/performance-evaluation',
    submenu: [
      {
        code: 'PERFORMANCE_GOAL_SETTING',
        name: 'Goal Setting',
        pathname: '/performance-evaluation/goal-setting',
      },
      {
        code: 'PERFORMANCE_MID_YEAR',
        name: 'Mid Year Coaching',
        pathname: '/performance-evaluation/mid-year',
      },
      {
        code: 'PERFORMANCE_END_YEAR',
        name: 'End Year Coaching',
        pathname: '/performance-evaluation/end-year',
      },
    ],
  },
  {
    code: 'PERFORMANCE MANAGEMENT',
    name: 'Performance Monitoring',
    icon: '/icons-revamp/perfManage.jpeg',
    iconActive: '/icons-revamp/perfManage.jpeg',
    pathname: '/performance-monitoring',
    submenu: [
      {
        code: 'PERFORMANCE_PROGRAM',
        name: 'Program Performance ',
        pathname: '/performance-monitoring/program-performance',
      },
      {
        code: 'PERFORMANCE_FORM',
        name: 'Performance Review Form',
        pathname: '/performance-monitoring/performance-review-form',
      },
      {
        code: 'TIMELINE_CONTROL',
        name: 'Timeline Tracking',
        pathname: '/performance-monitoring/timeline-tracking',
      },
      {
        code: 'PERFORMANCE_INQUIRY',
        name: 'Performance Analysis',
        pathname: '/performance-monitoring/performance-analysis',
      },
    ],
  },
  {
    code: 'REPORT',
    name: 'Performance Report',
    icon: '/icons-revamp/report.jpeg',
    iconActive: '/icons-revamp/report.jpeg',
    pathname: '/performance-report',
    submenu: [],
  },
  {
    code: 'MASTER',
    name: 'Key Data',
    icon: '/icons-revamp/master-data.jpeg',
    iconActive: '/icons-revamp/master-data.jpeg',
    pathname: '/key-data',
    submenu: [
      {
        code: 'MASTER_PERFORMANCE',
        name: 'Performance',
        pathname: '/key-data/performance',
      },
      {
        code: 'MASTER_PERFORMANCE_MEASUREMENT',
        name: 'Performance Metrics',
        pathname: '/key-data/performance-metrics',
      },
    ],
  },
  {
    code: 'CONFIGURATION',
    name: 'Settings',
    icon: '/icons-revamp/config.jpeg',
    iconActive: '/icons-revamp/config.jpeg',
    pathname: '/settings',
    submenu: [
      {
        code: 'PERFORMANCE_WORKFLOW',
        name: 'Performance Process',
        pathname: '/settings/performance-process',
      }
    ],
  },
];

export default MAIN_MENU;
