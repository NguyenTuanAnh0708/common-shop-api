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
// import { LoginResponse, UserResponse } from './types/auth.type';

// import { validatePassword } from '../decorator/validatePassword.util';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
  async login(@Body() loginDto: LoginDto) {
    // Convert and validate the DTO manually
    const dtoInstance = plainToInstance(LoginDto, loginDto);
    const errors = await validate(dtoInstance);

    // If there are validation errors, format and return them
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

    // Check if user exists
    const user = await this.authService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'User not found',
        errors: {
          field: 'email',
          message: 'User with this email does not exist.',
        },
      });
    }

    // Validate password
    const validPassword = await this.authService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid password',
        errors: [{ field: 'password', message: 'Password is incorrect.' }],
      });
    }

    // Generate access token
    const { password, ...userResponse } = user;
    const access_token = await this.jwtService.signAsync(userResponse);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: {
        user: userResponse,
        access_token: access_token,
      },
    };
  }
}
