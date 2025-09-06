import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: `title`, description: 'Clean Your Desk' })
  title: string;

  @Column()
  @ApiProperty({
    example: `title`,
    description: 'Organize papers, throw away trash',
  })
  description: string;

  @Column()
  @ApiProperty({ example: `1`, description: 'ID of the user' })
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'NULL',
    nullable: true,
  })
  @Exclude()
  deleted_at: Date;
}
