//O serviço de fatura é responsável por gerenciar a emissão de faturas para pagamentos do tipo SALDO aprovados.
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { FaturaValidatorService } from './fatura-validator.service';

@Injectable()
export class FaturaService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly faturaValidator: FaturaValidatorService,
    ) { }

    // Emite uma fatura para um pagamento de SALDO aprovado   
    // O parâmetro valorTotalReserva é opcional e pode ser usado para validar o valor da fatura com o valor total da reserva, caso seja necessário.
    async emitirFatura(pagamentoId: string, valorTotalReserva?: number,) {

        // Busca o pagamento no banco de dados
        const pagamento = await this.prisma.pagamento.findUnique({
            where: { id: pagamentoId },
        });

        // Verifica se o pagamento existe
        if (!pagamento) {
            throw new NotFoundException('Pagamento não encontrado.');
        }

        // Valida as regras de emissão
        this.faturaValidator.validarEmissao(
            pagamento.tipo,
            pagamento.status,
        );

        // Verifica se já existe uma fatura para o pagamento
        const faturaExistente = await this.prisma.fatura.findUnique({
            where: { pagamento_id: pagamentoId },
        });

        if (faturaExistente) {
            throw new ConflictException(
                'Já existe uma fatura para este pagamento.',
            );
        }

        // Gera os identificadores da fatura
        const id = randomUUID();
        const codigo = randomUUID();

        // Registra a fatura no MySQL
        const fatura = await this.prisma.fatura.create({
            data: {
                id,
                codigo,
                pagamento_id: pagamentoId,
                valor: pagamento.valor,
            },
        });

        return {
            ...fatura,
            valor_total_reserva: valorTotalReserva ?? null,
        };
    }

    // Cancela uma fatura emitida
    async cancelarFatura(id: string) {

        // Busca a fatura no banco de dados
        const fatura = await this.prisma.fatura.findUnique({
            where: { id },
        });

        // Verifica se a fatura existe
        if (!fatura) {
            throw new NotFoundException('Fatura não encontrada.');
        }

        // Valida se a fatura pode ser cancelada
        this.faturaValidator.validarCancelamento(fatura.status);

        // Atualiza o status da fatura no MySQL
        return this.prisma.fatura.update({
            where: { id },
            data: {
                status: 'CANCELADA',
            },
        });
    }

}
