import { HttpStatus } from '@nestjs/common';
import { ISuccessResponse } from '../constants';

export const createException = (
  code: number,
  httpStatusCode: HttpStatus,
  defaultMessage?: string,
) => {
  return (
    message?: string,
  ): { code: number; message: string; httpStatusCode: HttpStatus } => ({
    code: code,
    message: message || defaultMessage,
    httpStatusCode: httpStatusCode,
  });
};

export const success = <T>(
  code: number,
  httpStatusCode: HttpStatus,
  message: string,
  data?: T,
): ISuccessResponse<T> => ({
  success: {
    code,
    message,
    ...(data !== undefined && { data }),
    httpStatusCode,
  },
});
