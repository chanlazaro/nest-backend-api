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
    Note:
      - Uses ClassSerializerInterceptor to exclude sensitive fields like password
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async getAllUsers(): Promise<SingleResponseDto> {
    const users = await this.usersService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(users);
  }

  /* Get User by ID
    URL: /users/get_user?id=1
    Query Parameter:
      id: number (User ID)
    Returns:
      "data": [ { id, username, email }, ... ]
    Note:
      - Uses ClassSerializerInterceptor to exclude sensitive fields like password
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_user')
  async getUser(@Query('id') id: number) {
    // Fetch user by ID. Uses +id to convert string to number
    const user = await this.usersService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(user);
  }

  /* Update User
    URL: /users/update_user
    Query Parameter:
      username, password, new_password, email
    Returns:
      "data": [ { id, username, email }, ... ]
    Note:
      - Uses ClassSerializerInterceptor to exclude sensitive fields like password
   */
  @Patch('update_user')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const users = await this.usersService.update(updateUserDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(users);
  }
}
