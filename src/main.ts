// Main serve para inicializar a aplicação NestJS e configurar o servidor HTTP.
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// Função bootstrap é responsável por criar a aplicação NestJS e configurar o servidor HTTP.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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