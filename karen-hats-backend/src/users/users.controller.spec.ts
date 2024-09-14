import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn((dto: CreateUserDto) => ({
      id: 1,
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: 1, email: 'test1@example.com' },
      { id: 2, email: 'test2@example.com' },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      email: 'test@example.com',
    })),
    update: jest.fn((id: string, dto: UpdateUserDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({ id })),
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
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      // Include the 'username' property in the CreateUserDto
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
      // Convert the ID to a string as expected by the service
      const result = await usersController.findOne('1');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { email: 'updated@example.com' };
      // Convert the ID to a string
      const result = await usersController.update('1', dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(mockUsersService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Convert the ID to a string
      const result = await usersController.remove('1');
      expect(result).toEqual({ id: '1' });
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
