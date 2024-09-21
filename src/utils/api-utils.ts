import axios from "axios";
import { setAuthorizationHeader } from "./cookies-utils";
import LogOut from "../common/components/Logout/Logout";
import Toast from "../common/components/Toast/Toast";
import {
  WebSocketConnection,
  isAliveWebSocket,
} from "../common/webSocket/WebSocket";
import { socketData } from "../common/webSocket/SocketData";
import lodashGet from "lodash/get";
import { networkErrorMessages } from "../constants/messages";

const primaryBaseUrl = process.env.REACT_APP_API_UR2;
const secondaryBaseUrl = process.env.REACT_APP_API_URL;

let isNetworkErrorMsgShow = false;
let isPrimaryBaseUrlFailed = false;

const axiosConfig = {
  baseURL: primaryBaseUrl,
  timeout: 3600 * 5000,
};

export const mockAPI = axios.create(axiosConfig);

/**
 * @description Helper to retry a request with a different baseURL.
 * @param {AxiosRequestConfig} config The Axios request config object.
 * @param {string} baseUrl The new baseURL to use.
 */
const retryWithSecondaryUrl = (config: any) => {
  isPrimaryBaseUrlFailed = true;
  config.baseURL = secondaryBaseUrl;
  return mockAPI(config);
};

/**
 * @description Get the abortion pieces for the request (cancel token and connection timeout).
 */
const getRequestAbortionPieces = () => {
  const abort = axios.CancelToken.source();
  const connectionTimeout = setTimeout(
    () => abort.cancel(`Connection timeout of ${axiosConfig.timeout}ms.`),
    axiosConfig.timeout
  );
  return { abort, connectionTimeout };
};

/**
 * Generic GET method with retry logic.
 * @param {string} path
 * @param {{token: string}} options
 * @param {?Object.<string, any>} parameters URL parameters to include in the query string
 * @returns {Promise<AxiosResponse<any>>}
 */
export const get = async (
  path: any,
  { token, parameters, headers }: any = {},
  axiosClient = mockAPI
) => {
  const { abort, connectionTimeout } = getRequestAbortionPieces();
  try {
    const response = await axiosClient.get(`/${path}`, {
      headers: { ...headers, ...setAuthorizationHeader(token) },
      cancelToken: abort.token,
      params: parameters,
    });
    clearTimeout(connectionTimeout);
    return response;
  } catch (error) {
    clearTimeout(connectionTimeout);
    throw error;
  }
};

/**
 * Generic POST method with retry logic.
 * @param {string} path
 * @param {?Object.<string, any>} body
 * @param {{token: string}} options
 * @param {?Object.<string, any>} headers
 * @returns {Promise<AxiosResponse<any>>}
 */
export const post = async (
  path: any,
  body: any,
  { token }: any = {},
  headers?: any
) => {
  const { abort, connectionTimeout } = getRequestAbortionPieces();
  try {
    const response = await mockAPI.post(`/${path}`, body, {
      headers: { ...headers, ...setAuthorizationHeader(token) },
      cancelToken: abort.token,
    });
    clearTimeout(connectionTimeout);
    return response;
  } catch (error) {
    clearTimeout(connectionTimeout);
    throw error;
  }
};

/**
 * Generic DELETE method with retry logic.
 * @param {string} path
 * @param {{token: string}} options
 * @param {?Object.<string, any>} parameters URL parameters to include in the query string
 * @returns {Promise<AxiosResponse<any>>}
 */
export const del = async (
  path: any,
  { token, parameters, headers }: any = {},
  axiosClient = mockAPI
) => {
  const { abort, connectionTimeout } = getRequestAbortionPieces();
  try {
    const response = await axiosClient.delete(`/${path}`, {
      headers: { ...headers, ...setAuthorizationHeader(token) },
      cancelToken: abort.token,
      params: parameters,
    });
    clearTimeout(connectionTimeout);
    return response;
  } catch (error) {
    clearTimeout(connectionTimeout);
    throw error;
  }
};

/**
 * Generic PUT method with retry logic.
 * @param {string} path
 * @param {?Object.<string, any>} body
 * @param {{token: string}} options
 * @param {?Object.<string, any>} headers
 * @returns {Promise<AxiosResponse<any>>}
 */
export const put = async (
  path: any,
  body: any,
  { token }: any = {},
  headers?: any
) => {
  const { abort, connectionTimeout } = getRequestAbortionPieces();
  try {
    const response = await mockAPI.put(`/${path}`, body, {
      headers: { ...headers, ...setAuthorizationHeader(token) },
      cancelToken: abort.token,
    });
    clearTimeout(connectionTimeout);
    return response;
  } catch (error) {
    clearTimeout(connectionTimeout);
    throw error;
  }
};

/**
 * Generic PATCH method with retry logic.
 * @param {string} path
 * @param {?Object.<string, any>} body
 * @param {{token: string}} options
 * @returns {Promise<AxiosResponse<any>>}
 */
export const patch = async (path: any, body: any, { token }: any = {}) => {
  const { abort, connectionTimeout } = getRequestAbortionPieces();
  try {
    const response = await mockAPI.patch(`/${path}`, body, {
      headers: setAuthorizationHeader(token),
      cancelToken: abort.token,
    });
    clearTimeout(connectionTimeout);
    return response;
  } catch (error) {
    clearTimeout(connectionTimeout);
    throw error;
  }
};

/**
 * Handle server error messages and return a user-facing message.
 * @param {Error?} errorObject
 * @returns {string}
 */
export const getServerErrorMessage = (errorObject: any) => {
  const errorMessage = lodashGet(
    errorObject,
    "response.data.error",
    networkErrorMessages.serverDown
  );
  return errorMessage;
};

// Set default headers
mockAPI.defaults.headers.common = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

// Axios response interceptor for retry logic and WebSocket handling
mockAPI.interceptors.response.use(
  (response) => {
    try {
      if (!isAliveWebSocket() && !isPrimaryBaseUrlFailed) {
        let webSocket = new WebSocketConnection();
        webSocket.connect(socketData({ socketInstance: webSocket }));
      }
    } catch (e) {}
    return response;
  },
  async (error) => {
    if (error.message === "Network Error" && !error.response) {
      if (!isNetworkErrorMsgShow) {
        Toast(
          "error",
          "Network Error - You are offline",
          "3000",
          "bottom-right"
        );
        isNetworkErrorMsgShow = true;
        setTimeout(() => {
          isNetworkErrorMsgShow = false;
        }, 3200);
      }

      // Retry with secondary base URL if the primary fails
      if (!isPrimaryBaseUrlFailed) {
        return retryWithSecondaryUrl(error.config);
      }
    } else {
      const { status, data } = error.response;
      if (status === 401 && data.path !== "/users/login") {
        LogOut({ hardReload: false, routeTo: "/" });
      }
      return Promise.reject(error);
    }
  }
);
