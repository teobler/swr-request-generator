import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { client } from "example/request/client";
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method, RawAxiosRequestHeaders } from "axios";
// every project may have its own error type, define it your self and import it here
import { IResponseError } from "example/types";

export type SWRMutationConfig<Request = any, Response = any, Error = any> = SWRMutationConfiguration<
  AxiosResponse<Response>,
  AxiosError<Error>,
  Request,
  string
>;

export const useMutationRequest = <Request = any, Response = any, Error = any>({
  url,
  method,
  headers,
  mutationConfig,
  axiosConfig,
}: {
  url: string;
  method: Method;
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
    (url: string, options: { arg: Request }) => client.request({ url, method, headers, data: options, ...axiosConfig }),
    mutationConfig,
  );

  return { trigger, data, isMutating, error, reset };
};


// draft api here for demo, will delete it after working done
export const usePayOrder = (
  { id }: { id: string },
  mutationConfig?: SWRMutationConfig<PayOrderRequest, PayOrderResponse, IResponseError>,
  axiosConfig?: AxiosRequestConfig,
) => {
  return useMutationRequest({
    url: `/orders/${id}/personal-payment/confirmation`,
    method: "post",
    headers: {},
    mutationConfig,
    axiosConfig,
  });
};

interface PayOrderRequest {
  a: string;
  b: string;
}

interface PayOrderResponse {
  order: string;
}
