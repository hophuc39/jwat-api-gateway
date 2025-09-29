import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { AuthServiceClient } from 'jwat-protobuf/auth';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private authService: AuthServiceClient;

  constructor(
    private configService: ConfigService,
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
  ) {
    const secret = Buffer.from(
      configService.get<string>('jwt.accessTokenSecret') as string,
      'base64url',
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }
  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async validate(payload: any) {
    const userInfo = await firstValueFrom(
      this.authService.getUserInfo({ id: payload.sub }),
    );
    return {
      userId: payload.sub,
      username: payload.username,
      permissions: userInfo.permissions,
      roles: userInfo.roles,
    };
  }
}
