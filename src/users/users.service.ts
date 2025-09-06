import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
      updated_at: new Date(),
    });

    // Save user to the database and return success message
    await this.userRepository.save(newUser);
    return 'User registered successfully';
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
}
