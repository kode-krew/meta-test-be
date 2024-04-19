import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (exception instanceof UnauthorizedException) {
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
    } else {
      // 다른 HttpException 처리
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        response.status(status).json(exceptionResponse);
      } else {
        // 객체가 아니면 message로 처리
        response.status(status).json({ message: exceptionResponse });
      }
    }
  }
}
