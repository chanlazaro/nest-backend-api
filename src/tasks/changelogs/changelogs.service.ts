import { Injectable } from '@nestjs/common';
import { Changelog } from '../entities/changelog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { CreateChangeDto } from './dto/changelog.dto';
import { UpdateChangeDto } from './dto/changelog.dto';

@Injectable()
export class ChangelogsService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,

    @InjectRepository(Changelog)
    private changeRepository: Repository<Changelog>,
  ) {}

  async create(createChangeDto: CreateChangeDto) {
    // find if task exists to fetch the task id
    const taskExists = await this.taskRepository.findOne({
      select: ['id', 'title', 'status', 'project_id'],
      where: [{ id: createChangeDto.task_id }],
    });

    if (!taskExists) {
      return 'Task does not exist';
    } else if (taskExists.status != createChangeDto.old_status) {
      return 'Old status does not match current task status';
    }

    // Create new task
    const newTask = {
      task_id: taskExists.id,
      old_status: taskExists.status,
      new_status: createChangeDto.new_status,
      remarks: createChangeDto.remarks,
    };

    // Save task to the database and return success message
    const savedTask = await this.changeRepository.save(newTask);
    return {
      changelog_id: savedTask.id,
      task_id: savedTask.id,
      old_status: taskExists.status,
      new_status: createChangeDto.new_status,
      remarks: createChangeDto.remarks,
    };
  }

  findAll() {
    return this.changeRepository.find(); // Returns all changelogs
  }

  async findOne(id: number) {
    const changelog = await this.changeRepository.findOne({ where: { id } });
    if (!changelog) {
      return 'Changelog not found';
    }
    return changelog;
  }

  async update(updateChangeDto: UpdateChangeDto) {
    // Find changelog by id
    const changelog = await this.changeRepository.findOne({
      where: { id: updateChangeDto.change_id },
    });

    if (!changelog) {
      return 'Changelog not found';
    }

    // Update changelog details
    changelog.old_status = updateChangeDto.old_status || changelog.old_status;
    changelog.new_status = updateChangeDto.new_status || changelog.new_status;
    changelog.remarks = updateChangeDto.remarks || changelog.remarks;
    changelog.updated_at = new Date(); // Update the updated_at timestamp

    // Save updated user to the database
    const savedChange = await this.changeRepository.save(changelog);
    return {
      task_id: changelog.task_id,
      old_status: savedChange.old_status,
      new_status: savedChange.new_status,
      remarks: savedChange.remarks,
    };
  }
}
