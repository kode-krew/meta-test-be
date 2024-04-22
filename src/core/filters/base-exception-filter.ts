import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // filter passport-jwt error
    if (exception instanceof UnauthorizedException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        exceptionResponse['message'] === 'Unauthorized'
      ) {
        response.status(status).json({
          message: 'Invalid token',
          error: 'Unauthorized',
        });
      } else {
        response.status(status).json({
          message: exceptionResponse['message'],
          error: 'Unauthorized',
        });
      }
    }

    // filter class-validator
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        response.status(status).json({
          message: exceptionResponse['message'],
          error: exceptionResponse['error'] || exception.name,
        });
      } else {
        response.status(status).json({
          message:
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : 'Unknown error',
          error: exception.name,
        });
      }
    } else {
      // Non-HttpException errors
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: exception.message,
        error: 'Internal Server Error',
      });
    }
  }
}
