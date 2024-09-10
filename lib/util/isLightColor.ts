export const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const cR = parseInt(hex.substr(0, 2), 16);
  const cG = parseInt(hex.substr(2, 2), 16);
  const cB = parseInt(hex.substr(4, 2), 16);
  const brightness = (cR * 299 + cG * 587 + cB * 114) / 1000;
  return brightness > 155;
};
