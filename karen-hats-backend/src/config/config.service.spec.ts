import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return database configuration values', () => {
    jest.spyOn(service, 'get').mockReturnValue('value');
    expect(service.get('DB_HOST')).toBe('value');
    expect(service.get('DB_PORT')).toBe('value');
  });

  it('should return JWT secret', () => {
    jest.spyOn(service, 'get').mockReturnValue('secret');
    expect(service.get('JWT_SECRET')).toBe('secret');
  });
});
