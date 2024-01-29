import axios from "axios";
import lodashGet from "lodash/get";
import { networkErrorMessages } from "../constants/messages";
//import { baseUrl } from '../../../data/SiteConfig';
import { setAuthorizationHeader } from "./cookies-utils";
import LogOut from "../common/components/Logout/Logout";
import Toast from "../common/components/Toast/Toast";
import { WebSocketConnection, isAliveWebSocket } from "../common/webSocket/WebSocket";
import { socketData } from "../common/webSocket/SocketData";

const axiosConfig = {
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 3600 * 5000,
};
let isNetworkErrorMsgShow = false;
export const mockAPI = axios.create(axiosConfig);
/**
 * @description These pieces allow us to throw errors on connection timeouts
 * @see https://github.com/axios/axios/issues/647#issuecomment-459517694
 * @returns {{ abort: { token: string, cancel: function }, connectionTimeout: setTimeout }}
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
 * @param {string} path
 * @param {{token: string}} options
 * @param {?Object.<string, any>} parameters URL parameters to include in the query string
 * @returns {Promise<AxiosPromise<any>>}
 */
export const get = async (
    path: any,
    { token, parameters, headers }: any = {},
    axiosClient = mockAPI
) => {
    const { abort, connectionTimeout } = getRequestAbortionPieces();

    return axiosClient
        .get(`/${path}`, {
            headers: { ...headers, ...setAuthorizationHeader(token) },
            cancelToken: abort.token,
            params: parameters,
        })
        .then(response => {
            clearTimeout(connectionTimeout);
            return response;
        });
};

export const del = async (
    path: any,
    { token, parameters, headers }: any = {},
    axiosClient = mockAPI
) => {
    const { abort, connectionTimeout } = getRequestAbortionPieces();

    return axiosClient
        .delete(`/${path}`, {
            headers: { ...headers, ...setAuthorizationHeader(token) },
            cancelToken: abort.token,
            params: parameters,
        })
        .then(response => {
            clearTimeout(connectionTimeout);
            return response;
        });
};

/**
 * @param {string} path
 * @param {?Object.<string, any>} body
 * @param {{token: string}} options
 * @param {?Object.<string, any>} headers
 * @returns {Promise<AxiosResponse<any>>}
 */
export const post = async (path: any, body: any, { token }: any = {}, headers?: any) => {
    const { abort, connectionTimeout } = getRequestAbortionPieces();
    return mockAPI.post(`/${path}`, body, {
        headers: { ...headers, ...setAuthorizationHeader(token) },
        cancelToken: abort.token,
    }).then(response => {
        clearTimeout(connectionTimeout);
        return response;
    });
};

/**
 * @param {string} path
 * @param {?Object.<string, any>} body
 * @param {{token: string}} options
 * @param {?Object.<string, any>} headers
 * @returns {Promise<AxiosResponse<any>>}
 */
export const put = async (path: any, body: any, { token }: any = {}, headers?: any) => {
    const { abort, connectionTimeout } = getRequestAbortionPieces();
    return mockAPI.put(`/${path}`, body, {
        headers: { ...headers, ...setAuthorizationHeader(token) },
        cancelToken: abort.token,
    }).then(response => {
        clearTimeout(connectionTimeout);
        return response;
    });
};

/**
 * @param {string} path
 * @param {?Object.<string, any>} body
 * @param {{token: string}} options
 * @returns {Promise<AxiosResponse<any>>}
 */
export const patch = async (path: any, body: any, { token }: any = {}) => {
    const { abort, connectionTimeout } = getRequestAbortionPieces();

    return mockAPI.patch(`/${path}`, body, {
        headers: setAuthorizationHeader(token),
        cancelToken: abort.token,
    }).then(response => {
        clearTimeout(connectionTimeout);
        return response;
    });
};

/**
 * @description Take an expected server error object and return its error. If object is unexpected,
 * assume the server is down and return a relavant error message.
 *
 * @export
 * @param {Error?} errorObject
 * @returns {string} A user-facing error message
 */
export const getServerErrorMessage = (errorObject: any) => {
    // _.get's third argument is the default message
    // if errorObject.response.data.error doesn't resolve, it means that the server is down
    const errorMessage = lodashGet(
        errorObject,
        "response.data.error",
        networkErrorMessages.serverDown
    );

    return errorMessage;
};

mockAPI.defaults.headers.common = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
};

mockAPI.interceptors.response.use(
    response => {
        try {
            if (!isAliveWebSocket()) {
                let webSocket = new WebSocketConnection();
                webSocket.connect(socketData({ socketInstance: webSocket }));
            }
        } catch (e) { }
        return response;
    },
    error => {
        if ((error.message = "Network Error" && !error.response)) {
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
        } else {
            const { status, data, config } = error.response;
            if (status == 401 && data.path !== "/users/login") {
                LogOut({
                    hardReload: false,
                    routeTo:
                        "/"

                });
            }
            return Promise.reject(error);
        }
    }
);
