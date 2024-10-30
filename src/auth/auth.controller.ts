import {
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

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
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
    const jwtToken = this.jwtService.sign(userResponse);
    return {
      message: 'Login successful',
      user: userResponse,
      jwtToken: jwtToken,
    };
  }
}
