import { CacheModule, NotAcceptableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('AppController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  describe('root', () => {
    it("getUsers should return an array of numbers representing the users' ids", async () => {
      const result = [0, 1, 2, 3, 4];

      jest
        .spyOn(usersService, 'getUsers')
        .mockImplementation(async () => result);

      expect(await usersController.getUsers(createRequest())).toBe(result);
    });

    it('getUsers should throw NotAcceptableException when Accept header is different than application/json', async () => {
      const mockRequest = createRequest();

      mockRequest.headers.accept = 'application/javascript';

      await expect(usersController.getUsers(mockRequest)).rejects.toThrow(
        NotAcceptableException,
      );
    });

    it('getUser should return a user by id', async () => {
      const result: User = {
        name: 'John',
        email: 'johndoe@gmail.com',
      };

      jest
        .spyOn(usersService, 'getUser')
        .mockImplementation(async () => result);

      expect(await usersController.getUser(createRequest(), '')).toBe(result);
    });

    it('getUsers should throw NotAcceptableException when Accept header is different than application/json', async () => {
      const mockRequest = createRequest();

      mockRequest.headers.accept = 'application/javascript';

      await expect(usersController.getUser(mockRequest, '')).rejects.toThrow(
        NotAcceptableException,
      );
    });
  });
});
