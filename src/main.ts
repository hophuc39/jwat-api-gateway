import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcToHttpInterceptor } from './interceptor/grpc-to-http.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new GrpcToHttpInterceptor());
  await app.listen(process.env.PORT ?? 3001);

  console.log(
    `🚀 API Gateway GraphQL running at: http://localhost:${process.env.PORT}/graphql`,
  );
}
bootstrap();
