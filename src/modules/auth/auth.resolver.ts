import {
  BadRequestException,
  Inject,
  OnModuleInit,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { type ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthResponseModel } from './dto/auth-response.model';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { AuthServiceClient } from 'jwat-protobuf/auth';
import { UserInfoModel } from './dto/user-info.model';
import { GetUserInfoInput } from './dto/get-user-info.input';
import { GqlAuthGuard } from './guard/gql-auth.guard';

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
      if (err.code === 6) throw new BadRequestException(err.details);
      throw err;
    }
  }

  @Mutation(() => AuthResponseModel)
  async login(@Args('input') input: LoginInput) {
    try {
      return await firstValueFrom(this.authService.login(input));
    } catch (err: any) {
      console.log('ERROR ---- ');

      if (err.code === 5 || err.code === 16)
        throw new UnauthorizedException(err.details);
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

  @UseGuards(GqlAuthGuard)
  @Query(() => UserInfoModel)
  async getUserInfo(@Args('input') input: GetUserInfoInput) {
    try {
      return await firstValueFrom(this.authService.getUserInfo(input));
    } catch (err: any) {
      if (err.code === 5 || err.code === 16)
        throw new UnauthorizedException(err.message);
      throw err;
    }
  }
}
