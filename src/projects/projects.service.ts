import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,

    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    // find if user exists to fetch the user id
    const userExists = await this.userRepository.findOne({
      select: ['id', 'username'],
      where: [{ username: createProjectDto.user_id }],
    });

    if (!userExists) {
      return 'User does not exist';
    }
    Logger.log(`id: ` + userExists.id + ` title: ` + createProjectDto.title);

    //find if project exists for the user using it's id
    const projectExists = await this.projectRepository.findOne({
      select: ['user_id', 'title'],
      where: [{ user_id: userExists.id, title: createProjectDto.title }],
    });

    if (projectExists) {
      return 'Project already exists for the user';
    }

    // Create new project
    const newProject = this.projectRepository.create({
      user_id: userExists.id,
      title: createProjectDto.title,
      description: createProjectDto.description,
    });

    // Save user to the database and return success message
    const savedProject = await this.projectRepository.save(newProject);
    return {
      project_id: savedProject.id,
      title: savedProject.title,
      description: savedProject.description,
      user_id: userExists.id,
    };
  }

  findAll() {
    return this.projectRepository.find(); // Returns all projects
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      return 'Project not found';
    }
    return project;
  }

  async update(updateProjectDto: UpdateProjectDto) {
    // Find user by username
    const user = await this.userRepository.findOne({
      select: ['id', 'username'],
      where: { username: updateProjectDto.user_id },
    });

    if (!user) {
      return 'User not found';
    }

    // Find project by user id and project title
    const project = await this.projectRepository.findOne({
      where: { user_id: user.id, title: updateProjectDto.title },
    });

    // If project not found, throw error
    if (!project) {
      return 'Project not found';
    }

    // Update project details
    project.title = updateProjectDto.title || project.title;
    project.description = updateProjectDto.description || project.description;
    project.updated_at = new Date(); // Update the updated_at timestamp

    // Save updated user to the database
    const savedProject = await this.projectRepository.save(project);
    return {
      project_id: savedProject.id,
      title: savedProject.title,
      description: savedProject.description,
      user_id: savedProject.user_id,
    };
  }
}
