import useSWR, { ConfigInterface, responseInterface } from "swr";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { client } from "./client";

interface IReturn<Data, Error>
  extends Pick<
    responseInterface<AxiosResponse<Data>, AxiosError<Error>>,
    "isValidating" | "revalidate" | "error" | "mutate"
  > {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
}

interface ISWRConfig<Data = unknown, Error = unknown>
  extends Omit<ConfigInterface<AxiosResponse<Data>, AxiosError<Error>>, "onSuccess"> {
  onSuccess?: (response: AxiosResponse<Data>, key: string) => void;
}

export function createRequestHook<Data = unknown, Error = unknown>(
  axiosConfig: AxiosRequestConfig,
): ({ ...SWRConfig }?: ISWRConfig<Data, Error>) => IReturn<Data, Error> {
  return ({ ...SWRConfig } = {}) => {
    const { data: response, error, isValidating, revalidate, mutate } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
      axiosConfig && JSON.stringify(axiosConfig),
      () => client(axiosConfig),
      {
        ...SWRConfig,
      },
    );

    return {
      data: response && response.data,
      response,
      error,
      isValidating,
      revalidate,
      mutate,
    };
  };
}
