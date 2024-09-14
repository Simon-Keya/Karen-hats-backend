import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketsService } from './websockets.service';

describe('WebsocketsService', () => {
  let service: WebsocketsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketsService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ userId: 'user123' }),
          },
        },
      ],
    }).compile();

    service = module.get<WebsocketsService>(WebsocketsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a JWT token', () => {
    const userId = 'user123';
    const token = service.generateToken(userId);
    expect(token).toBe('token');
  });

  it('should validate a JWT token', () => {
    const token = 'some_token';
    const result = service.validateToken(token);
    expect(result).toEqual({ userId: 'user123' });
  });
});
