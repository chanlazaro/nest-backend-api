import { Test, TestingModule } from '@nestjs/testing';
import { TestLoginController } from './test-login.controller';

describe('TestLoginController', () => {
  let controller: TestLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestLoginController],
    }).compile();

    controller = module.get<TestLoginController>(TestLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
