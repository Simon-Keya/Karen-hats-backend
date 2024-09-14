import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { UtilsService } from '../utils/utils.service'; // Correct the import path
import { SharedModule } from './shared.module';

describe('SharedModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [ConfigService, UtilsService],
    }).compile();
  });

  it('should be defined', () => {
    expect(testingModule).toBeDefined();
  });

  it('should have ConfigService and UtilsService defined', () => {
    const configService = testingModule.get<ConfigService>(ConfigService); // Correct retrieval
    const utilsService = testingModule.get<UtilsService>(UtilsService); // Correct retrieval
    expect(configService).toBeDefined();
    expect(utilsService).toBeDefined();
  });
});
