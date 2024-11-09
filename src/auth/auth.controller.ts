import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto, RegisterDto } from 'src/auth/dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { LoginResponse, UserResponse } from './types/auth.type';

import { validatePassword } from '../decorator/validatePassword.util';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private validateePassword(password: string): any[] {
    return validatePassword(password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const dtoInstance = plainToInstance(RegisterDto, registerDto);
    const errors = await validate(dtoInstance);

    console.log(errors);
    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => {
        const firstConstraint = Object.values(error.constraints)[0];
        return { field: error.property, message: firstConstraint };
      });
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    const passwordErrors = this.validateePassword(registerDto.password);
    if (passwordErrors.length > 0) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        data: null,
        errors: passwordErrors,
      });
    }

    const user = await this.authService.findByEmail(registerDto.email);
    if (user) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    // Bước 1: Kiểm tra xem người dùng có tồn tại không
    const user = await this.authService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'login failed',
        data: null,
        errors: 'unauthorized',
      });
    }
    // Bước 2: Kiểm tra thủ công mật khẩu với các trường hợp khác nhau
    const passwordErrors = this.validateePassword(loginDto.password);
    if (passwordErrors.length > 0) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        data: null,
        errors: passwordErrors,
      });
    }

    // Bước 3: Kiểm tra tính hợp lệ của mật khẩu
    const validPassword = await this.authService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'login failed',
        data: null,
        errors: 'unauthorized',
      });
      // return {
      //   statusCode: HttpStatus.UNAUTHORIZED,
      //   message: 'Login failed',
      //   errors: 'Invalid password',
      // };
    }

    // Bước 4: Tạo access token cho người dùng
    const { password, ...userResponse } = user;
    const access_token = await this.jwtService.signAsync(userResponse);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: {
        user: userResponse as UserResponse,
        access_token: access_token,
      },
      errors: null,
    };
  }
}
