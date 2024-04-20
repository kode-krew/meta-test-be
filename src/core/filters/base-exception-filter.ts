import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from 'src/core/errors/database-error';

@Catch(Error)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message ? exception.message : 'Fatal Erorr';
    let error = 'Internal Server Error';

    response.status(status).json({
      message,
      error,
      statusCode: status,
    });
  }
}
