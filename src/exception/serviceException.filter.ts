import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {ServiceError} from './serviceError'

@Catch()
export class ServiceExceptionsFilter extends BaseExceptionFilter {
  constructor() {
    super();
  }

  catch(exception: ServiceError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message
    const errCode = exception['errCode']

    response
      .status(status)
      .json({
        status,
        data: [],
        errCode: errCode,
        errMsg: message,
      });
  }
}