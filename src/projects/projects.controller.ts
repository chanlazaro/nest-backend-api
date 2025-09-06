import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SingleResponseDto } from 'src/single-response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /* Create Project
    URL: /projects
    Parameter:
      projDetails: user_id, title, description
    Returns:
      "data": { description: 'Project created successfully' }
  */
  @Post('create')
  @ApiResponse({ status: 201, type: SingleResponseDto })
  async create(
    @Body(ValidationPipe) projDetails: CreateProjectDto,
  ): Promise<SingleResponseDto> {
    const project = await this.projectsService.create(projDetails);

    return new SingleResponseDto(project);
  }

  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @UseInterceptors(ClassSerializerInterceptor)
  async projectList(): Promise<SingleResponseDto> {
    const users = await this.projectsService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(users);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_project')
  async getProject(@Query('id') id: number) {
    // Fetch user by ID. Uses +id to convert string to number
    const user = await this.projectsService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(user);
  }

  @Patch('update_project')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async updateProject(@Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsService.update(updateProjectDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }
}
