import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user-profile.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUserRepository = {
    save: jest.fn((user: User) => Promise.resolve({ id: 1, ...user })),
    find: jest.fn(() => Promise.resolve([{ id: 1, email: 'test@example.com', username: 'testuser' }])),
    findOne: jest.fn((id: number) => Promise.resolve({ id, email: 'test@example.com', username: 'testuser' })),
    update: jest.fn((id: number, user: UpdateUserDto) => Promise.resolve({ id, ...user })),
    remove: jest.fn((id: number) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { email: 'test@example.com', password: 'test123', username: 'testuser' };
      const result = await usersService.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockUserRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersService.findAll();
      expect(result).toEqual([{ id: 1, email: 'test@example.com', username: 'testuser' }]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await usersService.findOne(1);
      expect(result).toEqual({ id: 1, email: 'test@example.com', username: 'testuser' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { email: 'updated@example.com' };
      const result = await usersService.update(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await usersService.remove(1);
      expect(result).toEqual({ id: 1 });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(1);
    });
  });
});
