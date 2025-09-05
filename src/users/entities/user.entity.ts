import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: `admin`, description: 'Username of the user' })
  username: string;

  @Column()
  @ApiProperty({
    example: `2bb12bb768eb669f0e4b9df29e22a00467eb513c275ccfff1013288facac7889`,
    description: 'Username of the user',
  })
  @Exclude()
  password: string;

  @Column({ unique: true })
  @ApiProperty({
    example: `user@provider.com`,
    description: 'Email of the user',
  })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
