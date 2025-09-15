import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangelogsController } from './changelogs/changelogs.controller';
import { ChangelogsService } from './changelogs/changelogs.service';
import { Changelog } from './entities/changelog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Task, Changelog])],
  controllers: [TasksController, ChangelogsController],
  providers: [TasksService, ChangelogsService],
})
export class TasksModule {}
