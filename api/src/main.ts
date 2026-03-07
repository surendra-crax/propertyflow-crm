import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://propertyflow-crm.vercel.app',
      'https://propertyflow.webxaitech.com',
    ],
    credentials: true
  });

  await app.listen(3000);
}

bootstrap();
