import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterPayload {
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsNotEmpty({ message: 'Username is required.' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters.' })
  userName: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters.' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password must include uppercase, lowercase, number, and special character.',
  })
  password: string;
}
