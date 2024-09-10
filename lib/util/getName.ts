export const getName = (user: any) =>
  user?.employee?.fullName || user?.username;
