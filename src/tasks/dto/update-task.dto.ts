import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNotEmpty } from 'class-validator';

// Used OmitType to exclude project_id from CreateTaskDto instead of PartialType
export class UpdateTaskDto extends OmitType(CreateTaskDto, [
  'project_id',
] as const) {
  @IsNotEmpty()
  @ApiProperty({ example: 'id' })
  id: number;
}
