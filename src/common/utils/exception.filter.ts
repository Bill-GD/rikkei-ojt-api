import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { ServiceResponse } from '../model/service-response';

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const http = host.switchToHttp(),
      // request = http.getRequest<Request>(),
      // response = http.getResponse<Response>(),
      status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

    // response
    //   .status(status)
    //   .json(ServiceResponse.failure(exception.message, null, status));
    //
    // console.log(request.url);

    if (exception instanceof Error) {
      console.log(exception.stack);
    }

    httpAdapter.reply(
      http.getResponse<Response>(),
      ServiceResponse.failure(
        exception instanceof HttpException
          ? exception.message
          : 'An error has occurred',
        exception,
        status,
      ),
      status,
    );
  }
}
