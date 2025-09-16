import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { TasksService } from './tasks/tasks.service';
import { ProjectsService } from './projects/projects.service';
import { ChangelogsService } from './tasks/changelogs/changelogs.service';
import { SingleResponseDto } from './single-response.dto';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
    private readonly logsService: ChangelogsService,
  ) {}

  // Seed database
  @Get('seed')
  async generateData(): Promise<SingleResponseDto> {
    const userData = await this.usersService.seed();
    const projectData = await this.projectsService.seed();
    const taskData = await this.tasksService.seed();
    const logData = await this.logsService.seed();

    return new SingleResponseDto({
      users: userData,
      projects: projectData,
      tasks: taskData,
      logs: logData,
    });
  }
}
