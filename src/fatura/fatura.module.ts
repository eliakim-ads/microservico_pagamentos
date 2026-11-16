
import { Module } from '@nestjs/common';
import { FaturaController } from './fatura.controller';
import { FaturaService } from './fatura.service';
import { FaturaValidatorService } from './fatura-validator.service';

@Module({
  controllers: [FaturaController],
  providers: [
    FaturaService,
    FaturaValidatorService,
  ],
})
export class FaturaModule {}
