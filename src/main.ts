import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Swagger API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Enable CORS to be used by frontend application
  app.enableCors({
    origin: 'http://localhost:3001', // Allow requests from Next.js (running on port 3001)
    credentials: true, // Allow sending cookies (for authentication)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
