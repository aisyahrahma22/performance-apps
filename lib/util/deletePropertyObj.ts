export const deletePropertyObj = (obj: any, properties: string[]) => {
  if (!obj) return obj;
  if (!properties) return obj;
  if (!Array.isArray(properties)) return obj;
  if (properties.length === 0) return obj;
  properties.forEach((property) => {
    delete obj[property];
  });
  return obj;
};
