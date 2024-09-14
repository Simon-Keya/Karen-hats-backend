import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service'; // Correct the import here
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService; // Change type to UsersService
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn((username: string) => Promise.resolve({ username })), // Use username instead of email
    create: jest.fn((dto: RegisterDto) => Promise.resolve({ id: 1, ...dto })),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockAccessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, // Change to UsersService here as well
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService); // Change type to UsersService
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const dto: LoginDto = { username: 'testuser', password: 'test123' }; // Use username here
      const result = await authService.login(dto);
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(userService.findByEmail).toHaveBeenCalledWith(dto.username); // Update this line to use username
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto: RegisterDto = { username: 'testuser', password: 'test123', email: 'test@example.com' }; // Include username
      const result = await authService.register(dto);
      expect(result).toEqual({ id: 1, username: dto.username, email: dto.email }); // Ensure username is included in the expected result
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });
});
