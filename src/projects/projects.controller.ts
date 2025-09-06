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
    URL: /projects/create
    Method: POST
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

  /* View all projects
    URL: /projects
    Method: GET
    Returns:
      "data": { description: 'Project created successfully' }
    Notes:
      - Uses ClassSerializerInterceptor to exclude fields marked with @Exclude() in the entity
  */
  @Get()
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @UseInterceptors(ClassSerializerInterceptor)
  async projectList(): Promise<SingleResponseDto> {
    const users = await this.projectsService.findAll();

    // Format the data as { data: [...] }
    return new SingleResponseDto(users);
  }

  /* View a project
    URL: /projects/get_project?id=1
    Method: GET
    Parameter: id
    Returns:
      "data": { / project fields / } 
    Notes:
      - Uses ClassSerializerInterceptor to exclude fields marked with @Exclude() in the entity
  */
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: SingleResponseDto })
  @Get('get_project')
  async getProject(@Query('id') id: number) {
    // Fetch project by ID. Uses +id to convert string to number
    const project = await this.projectsService.findOne(+id);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }

  /* Update a project
    URL: /projects/update_project
    Method: PATCH
    Returns:
      "data": { / project fields / } 
  */
  @Patch('update_project')
  @ApiResponse({ status: 200, type: SingleResponseDto })
  async updateProject(@Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsService.update(updateProjectDto);

    // Format the data as { data: [...] }
    return new SingleResponseDto(project);
  }
}
