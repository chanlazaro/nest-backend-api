import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: `title`, description: 'Add classes' })
  title: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @ApiProperty({
    example: `TODO`,
    description: 'Task status (e.g., TODO, IN_PROGRESS, DONE)',
  })
  status: string;

  @Column()
  @ApiProperty({ example: `contents`, description: 'Task content' })
  contents: string;

  @Column()
  @ApiProperty({ example: `1`, description: 'Project ID associated with task' })
  project_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
