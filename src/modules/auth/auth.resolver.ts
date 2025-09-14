import { Inject, OnModuleInit } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { GrpcMethod, type ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthService,
  ValidateTokenResponse,
} from 'src/modules/auth/dto/auth.type';

export class AuthResolver implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Query(() => String)
  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(@Args('token') token: string) {
    const res: ValidateTokenResponse = await firstValueFrom(
      this.authService.ValidateToken({ token }),
    );
    return res.valid ? `User ${res.userId} is valid` : 'Invalid token';
  }
}
