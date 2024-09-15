import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    create: jest.fn((dto: CreateUserDto) => ({
      id: 1,
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: 1, email: 'test1@example.com' },
      { id: 2, email: 'test2@example.com' },
    ]),
    findOne: jest.fn((id: number) => ({
      id,
      email: 'test@example.com',
    })),
    update: jest.fn((id: number, dto: UpdateUserDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: number) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { username: 'testuser', email: 'test@example.com', password: 'test123' };
      const result = await usersController.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersController.findAll();
      expect(result).toEqual([
        { id: 1, email: 'test1@example.com' },
        { id: 2, email: 'test2@example.com' },
      ]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await usersController.findOne('1'); // Keep id as string in controller
      expect(result).toEqual({ id: 1, email: 'test@example.com' }); // Expected object with correct id
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1); // Ensure service is called with number
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { email: 'updated@example.com' };
      const result = await usersController.update('1', dto); // Keep as string for controller but convert in service
      expect(result).toEqual({ id: 1, ...dto }); // Match as number
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto); // Match as number
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await usersController.remove('1'); // Keep as string for controller but convert in service
      expect(result).toEqual({ message: 'User with ID 1 has been deleted successfully' }); // Match expected message
      expect(mockUsersService.remove).toHaveBeenCalledWith(1); // Match as number
    });
  });
});
