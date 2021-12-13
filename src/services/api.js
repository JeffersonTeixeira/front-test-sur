import axios from 'axios';
import { getToken } from './auth';

export const BASE_URL = "http://localhost:8080";

export const AUTH_USER = BASE_URL + "/user/auth";

export const BASE_CLIENT_URL = BASE_URL + "/client";
export const CLIENT_LIST_URL = BASE_CLIENT_URL + "/list";


const api = axios.create({
    baseURL: BASE_URL
});

api.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;