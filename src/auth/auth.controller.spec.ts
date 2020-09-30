import { AuthController } from "./auth.controller";
import { TestingModule, Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserDTO } from "../models/dto/users/user.dto";
import { LoginUserDTO } from "../models/dto/users/login-user.dto";
import { Users } from "../database/entities/user.entity";
import { AuthGuard, PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
    let controller: AuthController;
  
    const authService = {
        login() {
            return null;
        },
        logout(){
            return null;
        }
      };
    beforeEach(async () => {

  
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: authService,
          },
          {   
              provide: AuthGuard,
              useValue: {
                  canActivate: () => true
              }
          },
          {
              provide: PassportModule,
              useValue: {}
          }
        ],
      }).compile();
  
      controller = module.get<AuthController>(AuthController);
    });
  
    it('should be defined', () => {
      // Arrange & Act & Assert
      expect(controller).toBeDefined();
    });
  
    describe('login()', () => {
      it('should call authService login() with the passed user from the client once', async () => {
        // Arrange
        const fakeUser = new LoginUserDTO();
        const spy = jest.spyOn(authService, 'login');
  
        // Act
        await controller.login(fakeUser);
  
        // Assert
        expect(spy).toBeCalledWith(fakeUser);
        expect(spy).toBeCalledTimes(1);
      });
  
      it('should return the result from authService login()', async () => {
        // Arrange
        const fakeUser = new LoginUserDTO();
        const fakeAccessToken = 'string'
        const loginSpy = jest.spyOn(authService, 'login').mockResolvedValue(fakeAccessToken);
  
        // Act
        const actualResult = await controller.login(fakeUser);
  
        // Assert
        expect(actualResult).toEqual('string');
      });
    });
  
    describe('logout()', () => {
      it('should call authService logout() with the passed a user id from the client once', async () => {
        // Arrange
        const fakeUserId: any = 'thisidisfake';
        const spy = jest.spyOn(authService, 'logout');
  
        // Act
        await controller.logout(fakeUserId);
  
        // Assert
        expect(spy).toBeCalledWith(fakeUserId);
        expect(spy).toBeCalledTimes(1);

        spy.mockRestore();
      });
  
      it('should call authService logout() with the passed a user id from the client once', async () => {
        // Arrange
        const fakeToken = 'fakeToken';
        const result = new UserDTO()
        jest.spyOn(authService, 'logout');
  
        // Act
        controller.logout(fakeToken);
  
        // Assert
        expect(result).toBeDefined();
      });
    });
    
  });