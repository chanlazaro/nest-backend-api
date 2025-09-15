import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // Get the request object
    const request = context.switchToHttp().getRequest();
    // Get the token from the Authorization header
    const authorizationKey = request.headers.authorization;
    const token = authorizationKey?.split(' ')[1];

    // If no token, deny access
    if (!token) {
      throw new UnauthorizedException('No Access');
    }

    try {
      const insideToken = await this.jwtService.verifyAsync(token);

      request.user = {
        userId: insideToken.sub,
        username: insideToken.username,
        email: insideToken.email,
      };

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
