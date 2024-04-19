import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT', 3001);
  const host = configService.get<string>('API_HOST');

  const config = new DocumentBuilder()
    .setTitle('Небольшой сервер на сокетах')
    .setDescription('Документация по REST API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(port, () => {
    console.log(
      `App started on ${host}${port}\nДокументация: ${host}${port}/swagger`,
    );
  });
}
bootstrap();
