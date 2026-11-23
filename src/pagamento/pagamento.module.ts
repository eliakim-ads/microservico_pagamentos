
import { Module } from '@nestjs/common';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';
import { PagamentoValidatorService } from './pagamento-validator.service';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [
    NotificacoesModule,
  ],
  controllers: [
    PagamentoController,
  ],
  providers: [
    PagamentoService,
    PagamentoValidatorService,
  ],
})

export class PagamentoModule {}
