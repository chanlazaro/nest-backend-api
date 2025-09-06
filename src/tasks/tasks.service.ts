import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,

    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // find if project exists to fetch the project id
    const projectExists = await this.projectRepository.findOne({
      select: ['id', 'title'],
      where: [{ id: createTaskDto.project_id }],
    });

    if (!projectExists) {
      return 'Project does not exist';
    }

    // Create new task
    const newTask = {
      project_id: projectExists.id,
      title: createTaskDto.title,
      contents: createTaskDto.contents,
      status: createTaskDto.status,
    };

    // Save task to the database and return success message
    const savedTask = await this.taskRepository.save(newTask);
    return {
      task_id: savedTask.id,
      title: savedTask.title,
      status: savedTask.status,
      contents: savedTask.contents,
      project_id: savedTask.id,
    };
  }

  findAll() {
    return this.taskRepository.find(); // Returns all tasks
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      return 'Task not found';
    }
    return task;
  }

  async update(updateTaskDto: UpdateTaskDto) {
    Logger.debug('Update DTO received: ' + JSON.stringify(updateTaskDto));

    // Find task by id
    const task = await this.taskRepository.findOne({
      where: { id: updateTaskDto.id },
    });

    if (!task) {
      return 'Task not found';
    }

    // Update project details
    task.title = updateTaskDto.title || task.title;
    task.contents = updateTaskDto.contents || task.contents;
    task.status = updateTaskDto.status || task.status;
    task.updated_at = new Date(); // Update the updated_at timestamp

    // Save updated user to the database
    const savedTask = await this.taskRepository.save(task);
    return {
      task_id: savedTask.id,
      title: savedTask.title,
      status: savedTask.status,
      contents: savedTask.contents,
      project_id: savedTask.project_id,
    };
  }
}
