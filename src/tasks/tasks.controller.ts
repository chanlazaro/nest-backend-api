import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiResponse } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/single-response.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /* Create task
    URL: /tasks/create
    Method: POST
    Parameter:
      createTaskDto: project_id, title, status, contents
    Returns:
      "data": { description: 'Project created successfully' }
  */
  @Post('create')
  @ApiResponse({ status: 201, type: SingleResponseDto })
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<SingleResponseDto> {
    const task = await this.tasksService.create(createTaskDto);

    return new SingleResponseDto(task);
  }

  /* Task List
    URL: /tasks
    Method: GET
    Returns:
      "data": { / task list with all fields / }
  */
  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async taskList(): Promise<SingleResponseDto> {
    const tasks = await this.tasksService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(tasks);
  }

  /* View a task
    URL: /tasks/get_task?id=1
    Method: GET
    Returns:
      "data": { / task with all fields / }
  */
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_task')
  async getTask(@Query('id') id: number) {
    // Fetch task by ID. Uses +id to convert string to number
    const task = await this.tasksService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(task);
  }

  /* Update task
    URL: /tasks/update_task
    Method: PATCH
    Parameter:
      updateTaskDto: id, title, status, contents
    Returns:
      "data": { / task with some fields / }
  */
  @Patch('update_task')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async updateProject(@Body() updateTaskDto: UpdateTaskDto) {
    const project = await this.tasksService.update(updateTaskDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }
}
