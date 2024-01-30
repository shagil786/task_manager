import Axios from "axios";
import { get, patch, post, put, del } from "./api-utils";
import { getUserDetailsInfo } from "./userDetailsInfo";
const userId = getUserDetailsInfo()?.userId;

export const login = ({ email, password }: any) =>
    post(
        "users/login",
        {
            email,
            password,
        },
        {},
        {
            "Access-Control-Expose-Headers": "Authorization",
        },
    ).then(({ data }) => data);

export const signup = (formData: any) =>
    post(
        "users/signup",
        formData,
        {},
        {
            "Content-Type": "multipart/form-data",
            "Access-Control-Expose-Headers": "Authorization",
        },
    ).then(({ data }) => data);

export const getTask = (filter: any) =>
    get(
        `users/allTask/${userId}?${filter?.filter?.name ? `filter=${filter?.filter?.name}` : ""
        }&sortDirection=${filter?.order ? "desc" : "asc"}`,
    ).then(({ data }) => data);

export const getTaskCount = () =>
    get(`users/tasks/count/${userId}`).then(({ data }) => data);

export const taskDelete = (taskId: any) =>
    del(`users/task/${taskId}`).then(({ data }) => data);

export const statuses = () => get(`users/statuses`).then(({ data }) => data);

export const priorities = () =>
    get(`users/priorities`).then(({ data }) => data);

export const addTask = (body: any) =>
    post(`users/addTask/${userId}`, body).then(({ data }) => data);

export const editTaskDetails = (id: any, body: any) =>
    put(`users/tasks/${id}`, body).then(({ data }) => data);
