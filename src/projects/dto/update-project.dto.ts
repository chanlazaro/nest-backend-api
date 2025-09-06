import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsNotEmpty()
  id: number;
}
