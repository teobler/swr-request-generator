export interface ResponseError {
  error: Error;
}

interface Error {
  errorMessage: string;
  errorCode: number;
}
