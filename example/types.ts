export interface IResponseError {
  error: IError;
}

interface IError {
  errorMessage: string;
  errorCode: number;
}
