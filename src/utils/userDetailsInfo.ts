export const setUserDetailsInfo = (userInfo: any) => {
  localStorage.setItem("userDetailsInfo", JSON.stringify(userInfo));
  return true;
};

export const getUserDetailsInfo = () => {
  return localStorage.hasOwnProperty("userDetailsInfo")
    ? JSON.parse((localStorage.getItem("userDetailsInfo") as any))
    : false;
};

export const removeUserDetailsInfo = () => {
  return localStorage.hasOwnProperty("userDetailsInfo")
    ? localStorage.removeItem("userDetailsInfo")
    : false;
};
