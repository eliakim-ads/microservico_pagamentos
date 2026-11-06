// Modulo serve para agrupar os controllers e serviços relacionados ao pagamento, 
// facilitando a organização do código e a injeção de dependências. 

import { Module } from '@nestjs/common';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';
import { PagamentoValidatorService } from './pagamento-validator.service';

@Module({
    controllers: [PagamentoController],
    providers: [
        PagamentoService,
        PagamentoValidatorService,
    ],
})

export class PagamentoModule {}