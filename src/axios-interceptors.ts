import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from "axios";

class CustomResponseError extends Error {
  public code?: number;
  public originalStack?: string;
  public config?: AxiosRequestConfig;
}

const requestInterceptor = (
  requestConfig: AxiosRequestConfig
): AxiosRequestConfig => {
  requestConfig.headers!["x-request-start-time"] = new Date().getTime();

  const { data, headers, method } = requestConfig;
  const url = new URL(requestConfig.url || "", requestConfig.baseURL || "");
  const debugData = { data, headers, method, url };

  console.debug(`Sending ${(method || "").toUpperCase()} ${url}`, debugData);

  return requestConfig;
};

const responseInterceptor = (response: AxiosResponse<unknown>) => {
  const method = response.request.method;
  const startTime: number = response.config.headers![
    "x-request-start-time"
  ] as number;
  const responseTimeMs = new Date().getTime() - startTime;
  const { data, headers, status, statusText } = response;
  const url = new URL(response.request.path, response.config.baseURL || "");
  const debugData = {
    data,
    headers,
    method,
    status,
    statusText,
    url,
    responseTimeMs,
  };

  console.debug(`Finished ${method.toUpperCase()} ${url}`, debugData);

  return response;
};

const responseErrorInterceptor = async (error: AxiosError) => {
  const method = error.config?.method!;
  const headers = error.config?.headers!;
  const baseURL = error.config?.baseURL!;
  const { message, stack, response } = error;

  const newError = new CustomResponseError(message);
  newError.code = response?.status;
  newError.originalStack = stack;
  newError.config = { method, headers, baseURL };

  console.log("Finished");

  throw newError;
};

const axiosInterceptors = {
  setup: (axios: AxiosInstance) => {
    axios.interceptors.request.use(requestInterceptor);
    axios.interceptors.response.use(
      responseInterceptor,
      responseErrorInterceptor
    );
  },
};

export default axiosInterceptors;
