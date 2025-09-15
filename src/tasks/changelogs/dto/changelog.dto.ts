import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export class CreateChangeDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  task_id: number;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  @ApiProperty({ example: 'Todo', enum: TaskStatus })
  old_status: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  @ApiProperty({ example: 'Todo', enum: TaskStatus })
  new_status: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'contents' })
  remarks: string;
}

// Used OmitType to exclude task_id from CreateTaskDto instead of PartialType
export class UpdateChangeDto extends OmitType(CreateChangeDto, [
  'task_id',
] as const) {
  @IsNotEmpty()
  @ApiProperty({ example: 'id' })
  change_id: number;
}
