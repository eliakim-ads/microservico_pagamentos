// O controller de pagamento é responsável por receber as requisições HTTP relacionadas aos pagamentos,
import { Body, Controller, Get, Param, Patch, Post, ParseUUIDPipe, } from '@nestjs/common';

import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
// O import { ApiTags } from '@nestjs/swagger'; é usado para adicionar tags de documentação Swagger para o controller de pagamentos.
import { ApiTags, ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
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
  // GET /pagamentos/reserva/:reserva_id 
  // Lista todos os pagamentos de uma reserva específica
  @Get('reserva/:reserva_id')
  @ApiOperation({
    summary: 'Consultar pagamentos por reserva',
    description:
      'Retorna todos os pagamentos vinculados a uma reserva, ' +
      'ordenados pela data de pagamento, do mais recente para o mais antigo.',
  })
  @ApiParam({
    name: 'reserva_id',
    description: 'Identificador UUID da reserva',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pagamentos encontrados com sucesso. ' +
      'Retorna um array vazio caso não existam pagamentos para a reserva.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'c747b217-051c-4148-9eb8-67d1d7ff6221',
          },
          reserva_id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          valor: {
            type: 'string',
            example: '700',
          },
          tipo: {
            type: 'string',
            example: 'SALDO',
          },
          metodo: {
            type: 'string',
            example: 'PIX',
          },
          status: {
            type: 'string',
            example: 'APROVADO',
          },
          data_pagamento: {
            type: 'string',
            format: 'date-time',
            example: '2026-11-16T00:56:19.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'O identificador da reserva não é um UUID válido.',
  })
  async buscarPorReserva(
    @Param('reserva_id', ParseUUIDPipe) reservaId: string,
  ) {
    return this.pagamentoService.buscarPorReserva(reservaId);
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
