import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Router from 'next/router';
import http from "../../../utils/http";

axios.defaults.withCredentials = true;

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
};

axios.defaults.timeout = 30000;

export const get_request = async (
  url: string,
  config: AxiosRequestConfig<any> = {},
  key: number | undefined = 0,
  redirect: boolean | undefined = true
): Promise<AxiosResponse<any, any> | undefined> => {
  
  try {
    return await http.get(url, {
      ...config,
      headers: { ...headers },
    });
  } catch (ee) {

    if (key <= 6) {
      return get_request(url, config, key + 1, redirect);
    } else {
      if (redirect) {
        Router.push("/timeout");
      }else{
        console.log(ee)
          throw "Something went wrong, please try again";
      }
    }
  }
};

export const post_request = async (
  url: string,
  data: object,
  config: AxiosRequestConfig<any> = {} 
): Promise<AxiosResponse<any, any>> => {
  return await http.post(url, data, {
      ...config,
      headers: { ...headers },
  });
};

export const patch_request = async (
  url: string,
  data: object,
  config: AxiosRequestConfig<any> = {}
): Promise<AxiosResponse<any, any>> => {
  return await http.patch(url, data, {
      ...config,
      headers: { ...headers },
  });
};

export const del_request = async (
  url: string,
  config: AxiosRequestConfig<any> = {}
): Promise<AxiosResponse<any, any>> => {
  return await http.delete(url, {
    ...config,
    headers: { ...headers },
  });
};
