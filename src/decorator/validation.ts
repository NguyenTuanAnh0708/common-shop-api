import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const errors = exceptionResponse.errors || [];

    // Kiểm tra và ưu tiên lỗi "Password is required"
    const passwordRequiredError = errors.find(
      (error) =>
        error.field === 'password' && error.message.includes('required'),
    );
    const prioritizedErrors = passwordRequiredError
      ? [passwordRequiredError]
      : errors;

    response.status(status).json({
      statusCode: status,
      message: exceptionResponse.message || 'Validation failed',
      data: null,
      errors: prioritizedErrors,
    });
  }
}
