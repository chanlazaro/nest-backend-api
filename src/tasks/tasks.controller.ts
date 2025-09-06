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

  @Post('create')
  @ApiResponse({ status: 201, type: SingleResponseDto })
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<SingleResponseDto> {
    const task = await this.tasksService.create(createTaskDto);

    return new SingleResponseDto(task);
  }

  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async projectList(): Promise<SingleResponseDto> {
    const tasks = await this.tasksService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(tasks);
  }

  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_task')
  async getTask(@Query('id') id: number) {
    // Fetch user by ID. Uses +id to convert string to number
    const user = await this.tasksService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(user);
  }

  @Patch('update_task')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async updateProject(@Body() updateTaskDto: UpdateTaskDto) {
    const project = await this.tasksService.update(updateTaskDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }
}
