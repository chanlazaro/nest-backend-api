import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

@Entity('changelogs')
export class Changelog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: `task_id`, description: '1' })
  task_id: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @ApiProperty({
    example: `TODO`,
    description: 'Task status (e.g., TODO, IN_PROGRESS, DONE)',
  })
  old_status: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @ApiProperty({
    example: `TODO`,
    description: 'Task status (e.g., TODO, IN_PROGRESS, DONE)',
  })
  new_status: string;

  @Column()
  @ApiProperty({ example: `contents`, description: 'Task content' })
  remarks: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<Changelog>) {
    Object.assign(this, partial);
  }
}
