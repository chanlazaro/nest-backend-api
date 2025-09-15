import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/single-response.dto';
import { CreateChangeDto } from './dto/changelog.dto';
import { UpdateChangeDto } from './dto/changelog.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('changelogs')
export class ChangelogsController {
  constructor(private readonly changelogsService: ChangelogsService) {}

  /* Create task
      URL: /changelogs/create
      Method: POST
      Parameter:
        createTaskDto: task_id, old_status, new_status, remarks
      Returns:
        "data": { 
          "changeLog_id": 180,
          "task_id": 33,
          "old_status": "Todo",
          "new_status": "In Progress",
          "remark": "remarks1"
        }
    */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiResponse({ status: 201, type: SingleResponseDto })
  @ApiBearerAuth()
  async create(
    @Body(ValidationPipe) createChangeDto: CreateChangeDto,
  ): Promise<SingleResponseDto> {
    const task = await this.changelogsService.create(createChangeDto);

    return new SingleResponseDto(task);
  }

  /* Task List
    URL: /changelogs
    Method: GET
    Returns:
      "data": { / task list with all fields / }
  */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 201, type: SingleResponseDto })
  @ApiBearerAuth()
  async listAll(): Promise<SingleResponseDto> {
    const changelogs = await this.changelogsService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(changelogs);
  }

  /* View a task
      URL: /tasks/get_task?id=1
      Method: GET
      Returns:
        "data": { / task with all fields / }
    */
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_change')
  @ApiBearerAuth()
  async getChange(@Query('id') id: number) {
    // Fetch changelog by ID. Uses +id to convert string to number
    const changelog = await this.changelogsService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(changelog);
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
  async updateProject(@Body() updateChangeDto: UpdateChangeDto) {
    const project = await this.changelogsService.update(updateChangeDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }
}
