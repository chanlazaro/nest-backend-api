import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/single-response.dto';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';

@ApiTags('default')
@ApiBearerAuth()
@Controller('testlogin')
export class TestLoginController {
  @Post()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  login(@Body(ValidationPipe) credentials: AuthUserDto) {
    const singleResponseDto = new SingleResponseDto({ data: null });
    singleResponseDto.data = `Invalid credentials`;
    if (
      credentials.username === 'admin' &&
      credentials.password === 'password'
    ) {
      singleResponseDto.data = `Login successful`;
      return singleResponseDto;
    }
    return singleResponseDto;
  }
}
