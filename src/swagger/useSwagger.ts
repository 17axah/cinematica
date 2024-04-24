import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Cinematika')
    .setDescription('The Cinematika API description')
    .setVersion('1.0')
    .addTag('cinematika')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
}
