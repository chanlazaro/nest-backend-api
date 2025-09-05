import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 20)
  @ApiProperty({ example: 'username' })
  username: string;

  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({ example: 'password' })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'email' })
  email: string;
}
