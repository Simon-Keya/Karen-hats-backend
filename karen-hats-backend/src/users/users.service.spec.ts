import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUserRepository = {
    create: jest.fn((user: User) => ({ id: 1, ...user })),
    save: jest.fn((user: User) => Promise.resolve({ id: 1, ...user })),
    find: jest.fn(() => Promise.resolve([{ id: 1, email: 'test@example.com', username: 'testuser' }])),
    findOne: jest.fn((conditions: any) => {
      if (conditions.where.id === 1) {
        return Promise.resolve({ id: 1, email: 'test@example.com', username: 'testuser' });
      }
      return Promise.resolve(null);  // Simulate user not found for any other ID
    }),
    update: jest.fn((id: number, user: UpdateUserDto) => Promise.resolve({ affected: id === 1 ? 1 : 0 })),
    delete: jest.fn((id: number) => Promise.resolve({ affected: id === 1 ? 1 : 0 })),
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
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(Object));
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
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null); // Simulate user not found
      await expect(usersService.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { email: 'updated@example.com' };
      mockUserRepository.update.mockResolvedValueOnce({ affected: 1 });
      const result = await usersService.update(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw a NotFoundException if user to update is not found', async () => {
      mockUserRepository.update.mockResolvedValueOnce({ affected: 0 });
      await expect(usersService.update(2, { email: 'updated@example.com' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserRepository.delete.mockResolvedValueOnce({ affected: 1 });
      const result = await usersService.remove(1);
      expect(result).toBeUndefined(); // No value expected to be returned
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if user to remove is not found', async () => {
      mockUserRepository.delete.mockResolvedValueOnce({ affected: 0 });
      await expect(usersService.remove(2)).rejects.toThrow(NotFoundException);
    });
  });
});
