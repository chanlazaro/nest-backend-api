import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private userService: UsersService;
  constructor(configService: ConfigService, userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // It needs to fetch the key string. Otherwise, it will throw an error.
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
    this.userService = userService;
  }

  async validate(payload: { sub: number; username: string; email: string }) {
    const user = await this.userService.findOne(payload.sub);

    if (typeof user !== 'string') {
      Logger.debug('user found ' + user.username);
      return payload;
    } else {
      throw new UnauthorizedException('User not found');
    }
  }
}
