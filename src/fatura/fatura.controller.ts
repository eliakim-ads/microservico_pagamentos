// O controller de fatura é responsável por receber as requisições HTTP relacionadas às faturas, como emissão e cancelamento.
import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { FaturaService } from './fatura.service';

// o import { ApiTags } from '@nestjs/swagger'; é usado para adicionar tags de documentação Swagger para o controller de faturas.
import { ApiTags, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

class EmitirFaturaDto {
    @IsUUID()
    pagamento_id!: string;
}
@ApiTags('Faturas')
@Controller('faturas')
export class FaturaController {
    constructor(
        private readonly faturaService: FaturaService,
    ) { }

    // Emite uma fatura para um pagamento aprovado
    @Post()
    @ApiBody({
        schema: {
            type: 'object',
            required: ['pagamento_id'],
            properties: {
                pagamento_id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID do pagamento de SALDO aprovado',
                    example: 'c747b217-051c-4148-9eb8-67d1d7ff6221',
                },
                valor_total_reserva: {
                    type: 'number',
                    description: 'Valor total da reserva, informado temporariamente até a integração com o microsserviço de reservas',
                    example: 1000,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Fatura emitida com sucesso.',
    })
    @ApiResponse({
        status: 400,
        description: 'Pagamento não é do tipo SALDO ou não está APROVADO.',
    })
    @ApiResponse({
        status: 404,
        description: 'Pagamento não encontrado.',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe uma fatura para este pagamento.',
    })
    async emitirFatura(
        @Body('pagamento_id') pagamentoId: string,
        @Body('valor_total_reserva') valorTotalReserva?: number,
    ) {
        return this.faturaService.emitirFatura(
            pagamentoId,
            valorTotalReserva,
        );
    }

    // Cancela uma fatura emitida
    @Patch(':id/cancelar')
    @ApiParam({
        name: 'id',
        description: 'UUID da fatura que será cancelada',
        type: String,
        format: 'uuid',
        example: '11fdcea1-6c61-4ad0-b430-2f01be6ac51c',
    })
    @ApiParam({
        name: 'id',
        description: 'UUID da fatura que será cancelada',
        type: String,
        format: 'uuid',
        example: '11fdcea1-6c61-4ad0-b430-2f01be6ac51c',
    })
    @ApiResponse({
        status: 200,
        description: 'Fatura cancelada com sucesso.',
    })
    @ApiResponse({
        status: 400,
        description: 'A fatura não pode ser cancelada no status atual.',
    })
    @ApiResponse({
        status: 404,
        description: 'Fatura não encontrada.',
    })
    async cancelarFatura(
        @Param('id', new ParseUUIDPipe()) id: string,
    ) {
        return this.faturaService.cancelarFatura(id);
    }
}
