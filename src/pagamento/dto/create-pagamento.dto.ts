// Dto para criar um pagamento, contendo os campos necessários para a criação de um pagamento.

import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsUUID, } from 'class-validator';
// Importa os tipos de enumeração gerados pelo Prisma para validação dos campos tipo e metodo
import { pagamento_tipo, pagamento_metodo, } from '../../../generated/prisma/client';
// Importa o decorador ApiProperty do Swagger para documentação da API
import { ApiProperty } from '@nestjs/swagger';
// Define a classe CreatePagamentoDto com os campos necessários para criar um pagamento
export class CreatePagamentoDto {
  // Identificador da reserva
  @ApiProperty({
    description: 'Identificador UUID da reserva',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  reserva_id!: string;

  // Valor do pagamento
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Valor do pagamento em reais (R$)',
    example: 300.00,
    minimum: 0.01,
    multipleOf: 0.01,
  })
  valor!: number;

  // Tipo: SINAL, TOTAL ou SALDO
  @IsEnum(pagamento_tipo)
  @ApiProperty({
    description: 'Tipo do pagamento',
    enum: pagamento_tipo,
    example: pagamento_tipo.SINAL,
  })
  tipo!: pagamento_tipo;

  // Método: CREDITO, DEBITO, PIX ou DINHEIRO
  @IsEnum(pagamento_metodo)
  @ApiProperty({
    description: 'Método de pagamento',
    enum: pagamento_metodo,
    example: pagamento_metodo.CREDITO,
  })
  metodo!: pagamento_metodo;
}