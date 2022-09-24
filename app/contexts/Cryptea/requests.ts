import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

axios.defaults.baseURL = "https://ab.cryptea.me";
axios.defaults.withCredentials = true;

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
};

export const get_request = async (
  url: string,
  config: AxiosRequestConfig<any> = {}
): Promise<AxiosResponse<any, any>> => {

  const token:string = localStorage.getItem("userToken") ?? '';

  return axios.get("/sanctum/csrf-cookie").then(async (e) => {
    return await axios.get(url, {
      ...config,
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });
  });
};

export const post_request = async (
  url: string,
  data: object,
  config: AxiosRequestConfig<any> = {} 
): Promise<AxiosResponse<any, any>> => {
  return axios.get("/sanctum/csrf-cookie").then(async (e) => {
     const token: string = localStorage.getItem("userToken") ?? "";
    return await axios.post(url, data, {
      ...config,
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });
  });
};

export const patch_request = async (
  url: string,
  data: object,
  config: AxiosRequestConfig<any> = {}
): Promise<AxiosResponse<any, any>> => {
  return axios.get("/sanctum/csrf-cookie").then(async (e) => {
    const token: string = localStorage.getItem("userToken") ?? "";
    return await axios.patch(url, data, {
      ...config,
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });
  });
};

export const del_request = async (
  url: string,
  config: AxiosRequestConfig<any> = {}
): Promise<AxiosResponse<any, any>> => {
  return axios.get("/sanctum/csrf-cookie").then(async (e) => {
   const token: string = localStorage.getItem("userToken") ?? "";
   
    return await axios.delete(url, {
      ...config,
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });
  });
};
