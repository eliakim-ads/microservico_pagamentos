
import { Module } from '@nestjs/common';
import { FaturaController } from './fatura.controller';
import { FaturaService } from './fatura.service';
import { FaturaValidatorService } from './fatura-validator.service';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [NotificacoesModule],
  controllers: [FaturaController],
  providers: [
    FaturaService,
    FaturaValidatorService,
  ],
})
export class FaturaModule {}
