const convertStringToBoolean = (data: string) => {
  return data?.toLowerCase() === 'true' ? true : false;
};

export default convertStringToBoolean;
