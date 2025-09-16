import { Injectable, Logger } from '@nestjs/common';
import { Changelog } from '../entities/changelog.entity';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
    } else if (taskExists.status == createChangeDto.new_status) {
      return 'Old status and new status are the same';
    }

    // Create new changelog
    const newLog = this.changeRepository.create({
      task_id: taskExists.id,
      old_status: taskExists.status,
      new_status: createChangeDto.new_status,
      remarks: createChangeDto.remarks,
    });

    // Save changelog to the database and return success message
    const savedTask = await this.changeRepository.save(newLog);
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

    // Save updated changelog to the database
    const savedChange = await this.changeRepository.save(changelog);
    return {
      task_id: changelog.task_id,
      old_status: savedChange.old_status,
      new_status: savedChange.new_status,
      remarks: savedChange.remarks,
    };
  }

  // Function to seed changelogs to database
  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const log1 = this.changeRepository.create({
        task_id: 1,
        old_status: 'Todo',
        new_status: 'In Progress',
        remarks: 'remarks',
      });
      await queryRunner.manager.save(log1);

      const log2 = this.changeRepository.create({
        task_id: 2,
        old_status: 'Todo',
        new_status: 'Done',
        remarks: 'remarks',
      });
      await queryRunner.manager.save(log2);

      const log3 = this.changeRepository.create({
        task_id: 3,
        old_status: 'Done',
        new_status: 'In Progress',
        remarks: 'remarks',
      });
      await queryRunner.manager.save(log3);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      Logger.error(err);
      await queryRunner.rollbackTransaction();
      return 'TRANSACTION ROLLBACKED Reason: ' + err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    return 'Tasks saved!';
  }
}
