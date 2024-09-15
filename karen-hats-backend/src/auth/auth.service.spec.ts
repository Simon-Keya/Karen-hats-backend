import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn((dto: RegisterDto) => ({ id: 1, ...dto })),
    save: jest.fn((user: User) => Promise.resolve({ id: 1, username: user.username, email: user.email })),
    findOne: jest.fn((options: any) => {
      if (options.where.username === 'testuser') {
        return Promise.resolve({ id: 1, username: 'testuser', password: bcrypt.hashSync('test123', 10) });
      }
      return Promise.resolve(null);
    }),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockAccessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const dto: LoginDto = { username: 'testuser', password: 'test123' };
      const user = await mockUserRepository.findOne({ where: { username: dto.username } });

      // Validate password (mock bcrypt comparison)
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const result = await authService.login(dto);
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: dto.username } });
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto: RegisterDto = { username: 'testuser', password: 'test123', email: 'test@example.com' };
      
      // Register the user and expect the password to be removed from the result.
      const result = await authService.register(dto);
      
      // Expected result should not contain the password.
      const expectedUser = { id: 1, username: dto.username, email: dto.email };

      // Validate the result and ensure password is excluded
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        username: dto.username,
        email: dto.email,
        password: dto.password,
      }));
    });
  });
});
