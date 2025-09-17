import {
  BadRequestException,
  Inject,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { type ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from 'proto/auth';
import { firstValueFrom } from 'rxjs';
import { AuthResponseModel } from './dto/auth-response.model';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';

export class AuthResolver implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  @Mutation(() => AuthResponseModel)
  async register(@Args('input') input: RegisterInput) {
    try {
      return await firstValueFrom(this.authService.register(input));
    } catch (err: any) {
      if (err.code === 6) throw new BadRequestException(err.message);
      throw err;
    }
  }

  @Mutation(() => AuthResponseModel)
  async login(@Args('input') input: LoginInput) {
    try {
      return await firstValueFrom(this.authService.login(input));
    } catch (err: any) {
      if (err.code === 5 || err.code === 16)
        throw new UnauthorizedException(err.message);
      throw err;
    }
  }

  @Mutation(() => AuthResponseModel)
  async refreshToken(@Args('input') input: RefreshTokenInput) {
    try {
      return await firstValueFrom(this.authService.refreshToken(input));
    } catch (err: any) {
      if (err.code === 5 || err.code === 16)
        throw new UnauthorizedException(err.message);
      throw err;
    }
  }
}
