import { status } from '@grpc/grpc-js';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      catchError((err) => {
        console.log('GRPC ERROR', err);

        switch (err.code) {
          case status.NOT_FOUND:
            return throwError(() => new NotFoundException(err.details));
          case status.INVALID_ARGUMENT:
            return throwError(() => new BadRequestException(err.details));
          case status.UNAUTHENTICATED:
            return throwError(() => new UnauthorizedException(err.details));
          case status.PERMISSION_DENIED:
            return throwError(() => new ForbiddenException(err.details));
          default:
            return throwError(
              () =>
                new InternalServerErrorException(
                  err.details || 'Internal server error',
                ),
            );
        }
      }),
    );
  }
}
