// you can use this file as your request handler directly,
// or you can use your own request handler file, just need to align hook name and interface
import useSWR, { SWRResponse } from "swr";
import { SWRConfiguration } from "swr/_internal";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { client } from "./client";
import { omit } from "lodash";

export interface IReturn<Data, Error>
  extends Pick<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>, "isValidating" | "error" | "mutate" | "isLoading"> {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
}

export interface ISWRConfig<Data = unknown, Error = unknown>
  extends Omit<SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>, "onSuccess"> {
  onSuccess?: (response: AxiosResponse<Data>, key: string) => void;
  shouldFetch?: boolean;
}

export const generateSwrConfigWithShouldFetchProperty = <Data, Error>(
  SWRConfig?: ISWRConfig<Data, Error>,
): ISWRConfig<Data, Error> =>
  SWRConfig
    ? !SWRConfig.shouldFetch
      ? SWRConfig
      : {
          ...SWRConfig,
          shouldFetch: true,
        }
    : { shouldFetch: true };

export const useGetRequest = <Data = unknown, Error = unknown>(
  axiosConfig: AxiosRequestConfig,
  SWRConfig?: ISWRConfig<Data, Error>,
): IReturn<Data, Error> => {
  const swrConfig = generateSwrConfigWithShouldFetchProperty(SWRConfig);
  const {
    data: response,
    error,
    isValidating,
    mutate,
    isLoading,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => (swrConfig.shouldFetch ? axiosConfig.url! : null),
    () => client(axiosConfig),
    {
      ...omit(swrConfig, ["shouldFetch"]),
    },
  );
  return { data: response && response.data, response, error, isValidating, isLoading, mutate };
};
