import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    // find if user exists to fetch the user id
    const userExists = await this.userRepository.findOne({
      select: ['id', 'username'],
      where: [{ id: Number(createProjectDto.user_id) }],
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

    // Save projeect to the database and return success message
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
    // Find user by user_id
    const user = await this.userRepository.findOne({
      where: { id: Number(updateProjectDto.user_id) },
    });

    if (!user) {
      return 'User not found';
    }

    // Find project by project id
    const project = await this.projectRepository.findOne({
      where: { id: updateProjectDto.project_id, user_id: user.id },
    });

    // If project not found, throw error
    if (!project) {
      return 'Project not found';
    }

    // Update project details
    project.title = updateProjectDto.title || project.title;
    project.description = updateProjectDto.description || project.description;
    project.updated_at = new Date(); // Update the updated_at timestamp

    // Save updated project to the database
    const savedProject = await this.projectRepository.save(project);
    return {
      project_id: savedProject.id,
      title: savedProject.title,
      description: savedProject.description,
      user_id: savedProject.user_id,
    };
  }

  // Function to seed projects to database
  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const project1 = this.projectRepository.create({
        user_id: 1,
        title: 'title for user 1',
        description: 'lorem ipsum',
      });
      await queryRunner.manager.save(project1);

      const project2 = this.projectRepository.create({
        user_id: 2,
        title: 'title for user 2',
        description: 'lorem ipsum',
      });
      await queryRunner.manager.save(project2);

      const project3 = this.projectRepository.create({
        user_id: 3,
        title: 'title for user 3',
        description: 'lorem ipsum',
      });
      await queryRunner.manager.save(project3);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      Logger.log(err);
      await queryRunner.rollbackTransaction();
      return 'TRANSACTION ROLLBACKED Reason: ' + err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    return 'Projects saved!';
  }
}
