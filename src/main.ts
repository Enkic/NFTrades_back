import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  const configService: ConfigService = app.get(ConfigService);
  const server = await app.listen(configService.get<number>('PORT') || 8080);
  server.setTimeout(2147483647);
}
bootstrap();
