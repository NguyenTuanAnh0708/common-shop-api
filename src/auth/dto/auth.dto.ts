import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'The firstName of the user' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @Length(1, 255, {
    message: 'First name must be between 1 and 255 characters',
  })
  firstName: string;

  @ApiProperty({ description: 'The lastName of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(1, 255, { message: 'Last name must be between 1 and 255 characters' })
  lastName: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({ description: 'The username of the user' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters.' })
  @IsNotEmpty({ message: 'Username is required.' })
  userName: string;

  @ApiProperty({ description: 'The password for the user account' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password must include uppercase, lowercase, number, and special character.',
  })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}
