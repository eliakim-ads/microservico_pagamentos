// Main serve para inicializar a aplicação NestJS e configurar o servidor HTTP.
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Configuração do Swagger para documentação da API
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Função bootstrap é responsável por criar a aplicação NestJS e configurar o servidor HTTP.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Pagamentos')
    .setDescription(
      'Documentação do microsserviço de Pagamentos e Faturas do sistema de reservas de hotel.',
    )
    .setVersion('1.0')
    .addTag('Pagamentos', 'Gerenciamento de pagamentos')
    .addTag('Faturas', 'Emissão e cancelamento de faturas')
    .build();

  // Gera o documento OpenAPI
  const document = SwaggerModule.createDocument(app, config);

  // Disponibiliza a interface Swagger
  SwaggerModule.setup('api', app, document);

  // Ativa a validação automática dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,// Remove campos não definidos no DTO
      forbidNonWhitelisted: true, // Impede que campos não definidos no DTO sejam aceitos
      transform: true, // Permite a transformação automática dos tipos de dados
    }),
  );

  await app.listen(process.env.PORT ?? 3000); // Inicia o servidor HTTP na porta definida na variável de ambiente PORT ou na porta 3000 por padrão
}

void bootstrap();