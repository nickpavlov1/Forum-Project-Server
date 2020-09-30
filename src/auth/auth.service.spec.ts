import { AuthService } from "./auth.service";
import { TestingModule, Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UserDTO } from "../models/dto/users/user.dto";
import { LoginUserDTO } from '../models/dto/users/login-user.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { IJWTPayload } from '../../dist/auth/strategy/interface/jwt-payload.interface';
import { Users } from "../database/entities/user.entity";

describe('AuthService', () => {
  let service: AuthService;

  let userRepository: any;
  let jwtService: any;

  beforeEach(async () => {
    userRepository = {
      matchUserName() {
        /* empty */
      },
      validateUserPassword() {
        /* empty */
      },

      findOne() {
          //
      }
    };

    jwtService = {
      signAsync() {
        /* empty */
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    // Arrange & Act & Assert
    expect(service).toBeDefined();
  });

  describe('login()', () => {


    it('should throw error if user with such username does not exists', async () => {
      // Arrange
      const matchUserNameSpy = jest
        .spyOn(userRepository, 'matchUserName')
        .mockReturnValue(Promise.resolve(undefined));

      const validateUserPasswordSpy = jest
        .spyOn(userRepository, 'validateUserPassword')
        .mockReturnValue(Promise.resolve(true));

      const fakeToken = 'token';
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(fakeToken));

      const fakeUser: LoginUserDTO = {
        username: 'username',
        password: 'password',
      };

      // Act & Assert
      expect(service.login(fakeUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should call userRepository validateUserPassword() once with correct user', async () => {
      // Arrange
      const foundFakeUser = new UserDTO();
      const matchUserNameSpy = jest
        .spyOn(userRepository, 'matchUserName')
        .mockReturnValue(Promise.resolve(foundFakeUser));

      const validateUserPasswordSpy = jest
        .spyOn(userRepository, 'validateUserPassword')
        .mockReturnValue(Promise.resolve(true));

      const fakeToken = 'token';
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(fakeToken));

      const fakeUser: LoginUserDTO = {
        username: 'username',
        password: 'Password123!',
      };

      // Act
      await service.login(fakeUser);

      // Assert
      expect(validateUserPasswordSpy).toBeCalledWith(fakeUser);
      expect(validateUserPasswordSpy).toBeCalledTimes(1);
    });

    it('should throw error if the passed user password is invalid', async () => {
      // Arrange
      const foundFakeUser = new UserDTO();
      const matchUserNameSpy = jest
        .spyOn(userRepository, 'matchUserName')
        .mockReturnValue(Promise.resolve(foundFakeUser));

      const validateUserPasswordSpy = jest
        .spyOn(userRepository, 'validateUserPassword')
        .mockReturnValue(Promise.resolve(false));

      const fakeToken = 'token';
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(fakeToken));

      const fakeUser: LoginUserDTO = {
        username: 'username',
        password: 'password',
      };

      // Act & Assert
      expect(service.login(fakeUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should call jwtService signAsync() once with correct payload', async () => {
      // Arrange
      const foundFakeUser = new UserDTO();
      const matchUserNameSpy = jest
        .spyOn(userRepository, 'matchUserName')
        .mockReturnValue(Promise.resolve(foundFakeUser));

      const validateUserPasswordSpy = jest
        .spyOn(userRepository, 'validateUserPassword')
        .mockReturnValue(Promise.resolve('username'));

      const fakeToken = 'token';
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')

      const fakeUser: LoginUserDTO = {
        username: 'username',
        password: 'password',
      };
      const fakeReturnUser = new Users()
      const payload: IJWTPayload = { ...fakeReturnUser }
      // Act
      await service.login(fakeUser);
      // Assert
      expect(signAsyncSpy).toBeCalledWith(payload);
      expect(signAsyncSpy).toBeCalledTimes(1);
    });

    it('should return the token from the jwtService signAsync()', async () => {
      // Arrange
      const foundFakeUser = new UserDTO();
      const matchUserNameSpy = jest
        .spyOn(userRepository, 'matchUserName')
        .mockReturnValue(Promise.resolve(foundFakeUser));

      const validateUserPasswordSpy = jest
        .spyOn(userRepository, 'validateUserPassword')
        .mockReturnValue(Promise.resolve(true));

      const fakeToken = 'token';
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(fakeToken));

      const fakeUser: LoginUserDTO = {
        username: 'username',
        password: 'password',
      };

      // Act
      const result = await service.login(fakeUser);

      // Assert
      expect(result).toEqual({ accessToken: fakeToken });
    });
  });

});
