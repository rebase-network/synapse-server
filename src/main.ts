import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200,
    "credentials": false,
  }

  app.enableCors(options)

  if (!configService.isProduction()) {
    const options = new DocumentBuilder()
      .setTitle('Synapse Server APIs')
      .setDescription('Feel free to try out Synapse Server APIs')
      .setVersion('0.0.1')
      // .addTag('Synapse')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
