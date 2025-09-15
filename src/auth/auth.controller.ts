import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/single-response.dto';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async login(
    @Body(ValidationPipe) credentials: AuthUserDto,
  ): Promise<SingleResponseDto> {
    const user = await this.authService.validateUser(credentials);

    return new SingleResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  logout(@Res() res: Response) {
    return res.send({ data: 'Logged out successfully' });
  }
}
