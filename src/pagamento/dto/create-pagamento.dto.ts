// Dto para criar um pagamento, contendo os campos necessários para a criação de um pagamento.

import {  IsEnum,  IsNotEmpty,  IsNumber,  IsPositive,  IsUUID,} from 'class-validator';
// Importa os tipos de enumeração gerados pelo Prisma para validação dos campos tipo e metodo
import {
  pagamento_tipo,
  pagamento_metodo,
} from '../../../generated/prisma/client';
// Define a classe CreatePagamentoDto com os campos necessários para criar um pagamento
export class CreatePagamentoDto {

  // Identificador da reserva
  @IsNotEmpty()
  @IsUUID()
  reserva_id!: string;

  // Valor do pagamento
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor!: number;

  // Tipo: SINAL, TOTAL ou SALDO
  @IsEnum(pagamento_tipo)
  tipo!: pagamento_tipo;

  // Método: CREDITO, DEBITO, PIX ou DINHEIRO
  @IsEnum(pagamento_metodo)
  metodo!: pagamento_metodo;
}