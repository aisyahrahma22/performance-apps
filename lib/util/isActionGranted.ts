import { intersection, isEmpty } from 'lodash';

const isActionGranted = (
  actions: string[],
  actionsToCheck: string[],
): boolean => {
  return (
    isEmpty(actionsToCheck) || !isEmpty(intersection(actions, actionsToCheck))
  );
};

export default isActionGranted;
