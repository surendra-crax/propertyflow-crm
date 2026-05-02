import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Render health checks)
      if (!origin) return callback(null, true);

      const allowed = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://propertyflow-crm.vercel.app',
        'https://propertyflow.webxaitech.com',
      ];

      // Allow any *.vercel.app preview URL
      if (allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow explicit override via env
      const extra = process.env.ALLOWED_ORIGIN;
      if (extra && origin === extra) return callback(null, true);

      callback(null, false);
    },
    credentials: true,
  });

  // Render (and most PaaS) inject PORT — never hardcode 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 PropertyFlow API running on port ${port}`);
}

bootstrap();
