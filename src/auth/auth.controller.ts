import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/single-response.dto';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { AuthService } from './auth.service';

@ApiTags('default')
@ApiBearerAuth()
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async login(
    @Body(ValidationPipe) credentials: AuthUserDto,
  ): Promise<SingleResponseDto> {
    const user = await this.authService.validateUser(credentials);

    return new SingleResponseDto(user);
  }
}
