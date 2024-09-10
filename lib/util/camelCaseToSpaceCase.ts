import renderCapitalizeFirst from './renderCapitalizeFirst';

type SpaceCaseOption = {
  upperCase?: boolean;
};

const camelCaseToSpaceCase = (data: string, option?: SpaceCaseOption) => {
  const upperCase = option?.upperCase;
  const spaceCased = data?.replace(/([a-z])([A-Z])/g, '$1 $2');
  if (upperCase) return renderCapitalizeFirst(spaceCased);
  return spaceCased;
};

export default camelCaseToSpaceCase;
