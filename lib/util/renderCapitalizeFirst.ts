const renderCapitalizeFirst = (val: any) =>
  val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '—';

export default renderCapitalizeFirst;
