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
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Convert and validate the DTO manually
    const dtoInstance = plainToInstance(RegisterDto, registerDto);
    const errors = await validate(dtoInstance);

    console.log(errors);

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
    const user = await this.authService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const validPassword = await this.authService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    const access_token = await this.jwtService.signAsync(userResponse);
    return {
      message: 'Login successful',
      user: userResponse,
      access_token: access_token,
    };
  }
}
