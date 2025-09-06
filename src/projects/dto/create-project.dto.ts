import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'user_id' })
  user_id: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'title' })
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'description' })
  description: string;
}
