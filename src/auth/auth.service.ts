import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, ...userData } = registerDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
