import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'project_id' })
  project_id: number;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'title' })
  title: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  @ApiProperty({ example: 'TODO', enum: TaskStatus })
  status: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'contents' })
  contents: string;
}
