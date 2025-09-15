import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ValidationPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/single-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiResponse({ status: 201, type: SingleResponseDto })
  @ApiBearerAuth()
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<SingleResponseDto> {
    const task = await this.tasksService.create(createTaskDto, req);

    return new SingleResponseDto(task);
  }

  /* Task List
    URL: /tasks
    Method: GET
    Returns:
      "data": { / task list with all fields / }
  */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_task')
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @Patch('update_task')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @ApiBearerAuth()
  async updateProject(@Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    const project = await this.tasksService.update(updateTaskDto, req);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }
}
