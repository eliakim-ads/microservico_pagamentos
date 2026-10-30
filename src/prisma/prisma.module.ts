// Modulo serve para injetar o PrismaService em qualquer lugar da aplicação sem precisar importar o módulo toda vez.
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
