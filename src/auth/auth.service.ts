import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validateUser(userCreds: AuthUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: userCreds.username },
    });

    // if user not found
    if (!user) {
      throw new UnauthorizedException('No account found with that username');
    }

    // If user found, compare passwords
    if (!(await bcrypt.compare(userCreds.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    Logger.debug('Password match for user: ' + user.username);
    // Remove password as return object and disable eslint rule for unused vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
