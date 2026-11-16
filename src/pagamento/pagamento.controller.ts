// O controller de pagamento é responsável por receber as requisições HTTP relacionadas aos pagamentos,
import { Body, Controller, Get, Param, Patch, Post, ParseUUIDPipe, } from '@nestjs/common';

import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
// O import { ApiTags } from '@nestjs/swagger'; é usado para adicionar tags de documentação Swagger para o controller de pagamentos.
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
@ApiTags('Pagamentos')
@Controller('pagamentos')
export class PagamentoController {
  constructor(
    private readonly pagamentoService: PagamentoService,
  ) { }

  // GET /pagamentos - Lista todos os pagamentos
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos retornada com sucesso.',
  })
  async listarPagamentos() {
    return this.pagamentoService.listarPagamentos();
  }

  // POST /pagamentos - Cria um novo pagamento
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Pagamento criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou pagamento fora das regras de negócio.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada.',
  })
  async criarPagamento(@Body() dados: CreatePagamentoDto) {
    return this.pagamentoService.criarPagamento(dados);
  }

  // PATCH /pagamentos/:id/cancelar
  // Cancela um pagamento sem estorno
  @Patch(':id/cancelar')
  @ApiParam({
    name: 'id',
    description: 'UUID do pagamento que será cancelado',
    type: String,
    format: 'uuid',
    example: '6693dbce-fd12-4dea-ad8f-c3dc3b87516a',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamento cancelado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O pagamento não pode ser cancelado no status atual.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pagamento não encontrado.',
  })
  async cancelarPagamento(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.pagamentoService.cancelarPagamento(id);
  }

  // PATCH /pagamentos/:id/estornar
  // Realiza o estorno simulado de um pagamento aprovado
  @Patch(':id/estornar')
  @ApiParam({
    name: 'id',
    description: 'UUID do pagamento que será estornado',
    type: String,
    format: 'uuid',
    example: 'c747b217-051c-4148-9eb8-67d1d7ff6221',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamento estornado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O pagamento não pode ser estornado no status atual.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pagamento não encontrado.',
  })
  async estornarPagamento(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.pagamentoService.estornarPagamento(id);
  }

}
