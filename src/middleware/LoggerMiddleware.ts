import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const formattedTime = now.toLocaleString('vi-VN', options);
    const logMessage = `
        \x1b[36mRequest Received:\x1b[0m
        \x1b[32mMethod:\x1b[0m ${req.method}
        \x1b[33mFull URL:\x1b[0m ${fullUrl}
        \x1b[35mTime:\x1b[0m ${formattedTime}
        `;

    console.log(logMessage);
    next();
  }
}
