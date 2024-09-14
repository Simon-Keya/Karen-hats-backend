import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn((dto: LoginDto) => ({
      accessToken: 'mockAccessToken',
    })),
    register: jest.fn((dto: RegisterDto) => ({
      user: { id: 1, email: dto.email, username: dto.username }, // Include username in the mock response
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const dto: LoginDto = { username: 'testUser', password: 'test123' }; // Use username instead of email
      const result = await authController.login(dto);
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('register', () => {
    it('should register a user and return user data', async () => {
      const dto: RegisterDto = { 
        username: 'testUser', // Add username property
        password: 'test123', 
        email: 'test@example.com' 
      };
      const result = await authController.register(dto);
      expect(result).toEqual({
        user: { id: 1, email: dto.email, username: dto.username }, // Include username in the mock response
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });
});
