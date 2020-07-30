import axios, { AxiosInstance } from "axios";

export const API_DEFAULT_TIMEOUT = 30 * 1000;

export const client: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: API_DEFAULT_TIMEOUT,
});
