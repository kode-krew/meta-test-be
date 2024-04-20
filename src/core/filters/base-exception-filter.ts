import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Passport-JWT error
    if (exception instanceof UnauthorizedException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        exceptionResponse['message'] === 'Unauthorized'
      ) {
        return response.status(status).json({
          message: 'Invalid token',
          error: 'Unauthorized',
        });
      } else {
        return response.status(status).json({
          message: exceptionResponse['message'],
          error: 'Unauthorized',
        });
      }
    }

    // Class-validator
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        return response.status(status).json({
          message: exceptionResponse['message'],
          error: exceptionResponse['error'] || exception.name,
        });
      } else {
        return response.status(status).json({
          message:
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : 'Unknown error',
          error: exception.name,
        });
      }
    }

    // Non-HttpException errors
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: exception instanceof Error ? exception.message : 'Unknown error',
      error: 'Internal Server Error',
    });
  }
}
