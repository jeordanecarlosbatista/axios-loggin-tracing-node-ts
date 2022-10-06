import Axios, { AxiosInstance } from "axios";

import axiosInterceptors from "./axios-interceptors";

export default class AxiosClient {
  public baseURL: string;
  public headers: any;
  public timeout: number;

  public constructor(data: {
    baseUrl: string;
    headers?: any;
    timeoutInMillis?: number;
  }) {
    this.baseURL = data.baseUrl;
    this.headers = data.headers || {};
    this.timeout = data.timeoutInMillis || 0;
  }

  public getClient(): AxiosInstance {
    const axios = Axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: this.headers,
      validateStatus: (): boolean => true,
    });

    axiosInterceptors.setup(axios);

    return axios;
  }
}
