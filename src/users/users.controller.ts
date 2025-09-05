import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SingleResponseDto } from 'src/single-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* User Registration
    URL: /users/register
    Parameter:
      credentials: username, email, password
    Returns:
      "data": { description: 'User registered successfully' }
  */
  @Post('register')
  @ApiResponse({ status: 201, type: SingleResponseDto })
  async register(
    @Body(ValidationPipe) credentials: CreateUserDto,
  ): Promise<SingleResponseDto> {
    const user = await this.usersService.register(credentials);

    return new SingleResponseDto(user);
  }

  /* Get All Users
    URL: /users
    Returns:
      "data": [ { id, username, email }, ... ]
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async getAllUsers(): Promise<SingleResponseDto> {
    const users = await this.usersService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(users);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_user')
  async getUser(@Query('id') id: number) {
    // Fetch user by ID. Uses +id to convert string to number
    const user = await this.usersService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(user);
  }

  @Patch('update_user')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const users = await this.usersService.update(updateUserDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(users);
  }
}
