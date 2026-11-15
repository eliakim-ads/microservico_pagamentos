// O controller de pagamento é responsável por receber as requisições HTTP relacionadas aos pagamentos,
import {  Body,  Controller,  Get,  Param,  Patch,  Post,  ParseUUIDPipe,} from '@nestjs/common';

import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Controller('pagamentos')
export class PagamentoController {
  constructor(
    private readonly pagamentoService: PagamentoService,
  ) {}

  // GET /pagamentos - Lista todos os pagamentos
  @Get()
  async listarPagamentos() {
    return this.pagamentoService.listarPagamentos();
  }

  // POST /pagamentos - Cria um novo pagamento
  @Post()
  async criarPagamento(@Body() dados: CreatePagamentoDto) {
    return this.pagamentoService.criarPagamento(dados);
  }

  // PATCH /pagamentos/:id/cancelar
  // Cancela um pagamento sem estorno
  @Patch(':id/cancelar')
  async cancelarPagamento(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.pagamentoService.cancelarPagamento(id);
  }

  // PATCH /pagamentos/:id/estornar
  // Realiza o estorno simulado de um pagamento aprovado
  @Patch(':id/estornar')
  async estornarPagamento(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.pagamentoService.estornarPagamento(id);
  }

}
