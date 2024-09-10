import { replace } from 'lodash';
import { optionsInput } from '../../helper/learningVariables';

export const parseLearningUnit = (data: string) => {
  if (!data) return null;
  const value = replace(data, /\D/g, '');
  const unitInitial = replace(data, /[0-9]+/, '');
  const unit = optionsInput.find((v) => v.value == unitInitial)?.text;
  return `${value} ${unit}`;
};
