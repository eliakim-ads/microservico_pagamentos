
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { FaturaModule } from './fatura/fatura.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    PagamentoModule,
    FaturaModule,
    NotificacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
