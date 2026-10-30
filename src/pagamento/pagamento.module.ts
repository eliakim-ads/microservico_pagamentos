// Modulo serve para agrupar os controllers e serviços relacionados ao pagamento, 
// facilitando a organização do código e a injeção de dependências. 
// Foi adiconado o serviço de mock de reserva para simular a busca de reservas em um banco de dados.
import { Module } from '@nestjs/common';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';
import { ReservaMockService } from './reserva-mock.service';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService, ReservaMockService],
})
export class PagamentoModule {}