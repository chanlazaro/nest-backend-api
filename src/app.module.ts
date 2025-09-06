import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TestLoginController } from './test-login/test-login.controller';
import { User } from './users/entities/user.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot(),

    // TypeORM for MySQL Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', 3000),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, Task],
        synchronize: true,
        logging: ['query', 'error', 'schema'],
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [AppController, TestLoginController],
  providers: [AppService],
})
export class AppModule {}
