import cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
const isBrowser = typeof window !== `undefined`;

export const setAuthCookies = ({ id, token, username, userType }: any) => {
  cookie.set("token", token);
  cookie.set("username", username);
};

export const removeAuthCookies = () => {
  cookie.remove("token");
  cookie.remove("username");
};
export const setAuthorizationHeader = (token = getAuthToken()) => {
  return { Authorization: `Bearer ${token}` };
};
export const getUserName = () => {
  return cookie.get("username");
};
export const getAuthToken = () => {
  return cookie.get("token");
};

export const isLoggedIn = () => {
  if (!isBrowser) return false;
  return cookie.get("token") !== undefined;
};
export const hasValidAuthToken = (token = cookie.get("token")) => {
  if (token === undefined) {
    return false;
  }
  const jwt = jwtDecode(token);
  const currentTime = new Date().getTime() / 1000;

  return currentTime < jwt.exp!;
};
