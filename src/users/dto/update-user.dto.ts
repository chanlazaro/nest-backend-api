import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, Length } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

// Extends CreateUserDto to make all fields optional, then adds new_password field
export class UpdateUserDto extends PartialType(CreateUserDto) {
  username: string;
  @ApiProperty({ example: 'old_password' })
  password: string;

  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({ example: 'new_password' })
  new_password: string;

  email: string;
}
