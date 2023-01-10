import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { AxiosError, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";
import { client } from "src/request/client";

export type SWRMutationConfig<Request = any, Response = any, Error = any> = SWRMutationConfiguration<
  AxiosResponse<Response>,
  AxiosError<Error>,
  Request,
  string
>;

export const useMutationRequest = <
  Request extends { body?: any; query?: any } | undefined,
  Response = any,
  Error = any,
>({
  url,
  method,
  headers,
  mutationConfig,
  axiosConfig,
}: {
  url: string;
  method: string;
  headers: RawAxiosRequestHeaders;
  mutationConfig?: SWRMutationConfiguration<AxiosResponse<Response>, AxiosError<Error>, Request, string>;
  axiosConfig?: AxiosRequestConfig;
}) => {
  const { trigger, data, isMutating, error, reset } = useSWRMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    // assume all key is url, so it will be string type
    string,
    Request
  >(
    url,
    (url: string, options: { arg: Request }) =>
      client.request({ url, method, headers, data: options.arg?.body, params: options.arg?.query, ...axiosConfig }),
    mutationConfig,
  );

  return { trigger, data, isMutating, error, reset };
};
