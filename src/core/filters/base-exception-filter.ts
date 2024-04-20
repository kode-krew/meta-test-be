import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Check if the response is an object and has a 'message' property
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        response.status(status).json({
          message: exceptionResponse['message'],
          error: exceptionResponse['error'] || exception.name,
          statusCode: status,
        });
      } else {
        // If the response is not an object or doesn't have a 'message' property, handle as a string or fallback
        response.status(status).json({
          message:
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : 'Unknown error',
          error: exception.name,
          statusCode: status,
        });
      }
    } else {
      // Non-HttpException errors
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: exception.message,
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
