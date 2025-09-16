import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async register(credentials: CreateUserDto) {
    //find if user exists
    const userExists = await this.userRepository.findOne({
      select: ['username', 'email'],
      where: [{ username: credentials.username }, { email: credentials.email }],
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const newUser = this.userRepository.create({
      username: credentials.username,
      email: credentials.email,
      password: hashedPassword,
    });

    // Save user to the database and return success message
    await this.userRepository.save(newUser);
    return { username: credentials.username, email: credentials.email };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find(); // Returns all users
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return 'User not found';
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    // Find user by username and email
    const user = await this.userRepository.findOne({
      where: { username: updateUserDto.username, email: updateUserDto.email },
    });

    // If user not found, throw error
    if (!user) {
      return 'User not found';
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(
      updateUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return 'Invalid old password';
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(updateUserDto.new_password, 10);

    // Update user details
    user.password = hashedNewPassword;
    user.updated_at = new Date(); // Update the updated_at timestamp

    // Save updated user to the database
    await this.userRepository.save(user);
    return 'User updated successfully';
  }

  // Function to seed users to database
  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user1 = this.userRepository.create({
        username: 'admin',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin', 10),
      });
      await queryRunner.manager.save(user1);

      const user2 = this.userRepository.create({
        username: 'testuser1',
        email: 'testuser1@user.com',
        password: await bcrypt.hash('testuser1', 10),
      });
      await queryRunner.manager.save(user2);

      const user3 = this.userRepository.create({
        username: 'testuser2',
        email: 'testuser2@user.com',
        password: await bcrypt.hash('testuser2', 10),
      });
      await queryRunner.manager.save(user3);

      const user4 = this.userRepository.create({
        username: 'testuser3',
        email: 'testuser3@user.com',
        password: await bcrypt.hash('testuser3', 10),
      });
      await queryRunner.manager.save(user4);

      const user5 = this.userRepository.create({
        username: 'testuser4',
        email: 'testuser4@user.com',
        password: await bcrypt.hash('testuser4', 10),
      });
      await queryRunner.manager.save(user5);

      const user6 = this.userRepository.create({
        username: 'testuser5',
        email: 'testuser5@user.com',
        password: await bcrypt.hash('testuser5', 10),
      });
      await queryRunner.manager.save(user6);

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

    return 'Users saved!';
  }
}
