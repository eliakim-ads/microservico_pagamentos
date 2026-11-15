// Service responsável por gerenciar os pagamentos

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PagamentoValidatorService } from './pagamento-validator.service';

@Injectable()
export class PagamentoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagamentoValidator: PagamentoValidatorService,
    ) { }

    // Lista todos os pagamentos cadastrados
    async listarPagamentos() {
        return this.prisma.pagamento.findMany();
    }

    // Cria um novo pagamento
    async criarPagamento(dados: CreatePagamentoDto) {

        // Valida os dados antes de salvar
        this.pagamentoValidator.validarPagamento(dados);

        // Salva o pagamento no MySQL usando Prisma
        return this.prisma.pagamento.create({
            data: {
                reserva_id: dados.reserva_id,
                valor: dados.valor,
                tipo: dados.tipo,
                metodo: dados.metodo,
            },
        });
    }

    // Cancela um pagamento pendente sem realizar estorno
    async cancelarPagamento(id: string) {

        // Busca o pagamento no banco de dados
        const pagamento = await this.prisma.pagamento.findUnique({
            where: { id },
        });

        // Verifica se o pagamento existe
        if (!pagamento) {
            throw new NotFoundException(
                'Pagamento não encontrado.',
            );
        }

        // Valida se o pagamento pode ser cancelado
        this.pagamentoValidator.validarCancelamento(pagamento.status);

        // Atualiza o status somente se ainda estiver PENDENTE
        const resultado = await this.prisma.pagamento.updateMany({
            where: {
                id,
                status: 'PENDENTE',
            },
            data: {
                status: 'CANCELADO',
            },
        });

        // Impede cancelamento se o status mudou durante a operação
        if (resultado.count === 0) {
            throw new BadRequestException(
                'O pagamento não está mais pendente e não pode ser cancelado.',
            );
        }

        // Retorna o pagamento atualizado
        return this.prisma.pagamento.findUnique({
            where: { id },
        });
    }

    // Realiza o estorno simulado de um pagamento aprovado
    async estornarPagamento(id: string) {

        // Busca o pagamento no banco de dados
        const pagamento = await this.prisma.pagamento.findUnique({
            where: { id },
        });

        // Verifica se o pagamento existe
        if (!pagamento) {
            throw new NotFoundException(
                'Pagamento não encontrado.',
            );
        }

        // Valida se o pagamento pode ser estornado
        this.pagamentoValidator.validarEstorno(pagamento.status);

        // Atualiza o status somente se ainda estiver APROVADO
        const resultado = await this.prisma.pagamento.updateMany({
            where: {
                id,
                status: 'APROVADO',
            },
            data: {
                status: 'ESTORNADO',
            },
        });

        // Impede o estorno se o status mudou durante a operação
        if (resultado.count === 0) {
            throw new BadRequestException(
                'O pagamento não está mais aprovado e não pode ser estornado.',
            );
        }

        // Retorna o pagamento atualizado
        return this.prisma.pagamento.findUnique({
            where: { id },
        });
    }



}
