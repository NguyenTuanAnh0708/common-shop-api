import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterPayload } from 'src/auth/dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Post('register')
  register(@Body() data: RegisterPayload) {
    return data;
  }

  @Post('login')
  login(@Body() data: any) {
    return data;
  }
}
