import { last } from 'lodash';

const renderDuration = (val: any) => {
  if (val) {
    const splitVal = val.slice(0, -1);

    switch (last(val.split(''))) {
      case 's':
        return `${splitVal} Seconds`;
      case 'M':
        return `${splitVal} Minutes`;
      case 'h':
        return `${splitVal} Hours`;
      case 'd':
        return `${splitVal} Days`;
      case 'w':
        return `${splitVal} Weeks`;
      case 'm':
        return `${splitVal} Months`;
      case 'y':
        return `${splitVal} Years`;
      default:
        break;
    }

    return val;
  } else {
    return '—';
  }
};

export default renderDuration;
