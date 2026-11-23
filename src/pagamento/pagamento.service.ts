// Service responsável por gerenciar os pagamentos

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PagamentoValidatorService } from './pagamento-validator.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';

@Injectable()
export class PagamentoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagamentoValidator: PagamentoValidatorService,
        private readonly notificacoesService: NotificacoesService,
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
        const pagamento = await this.prisma.pagamento.create({
            data: {
                reserva_id: dados.reserva_id,
                valor: dados.valor,
                tipo: dados.tipo,
                metodo: dados.metodo,
            },
        });

        // Publica o evento no RabbitMQ após salvar o pagamento
        await this.notificacoesService.publicarEvento(
            'pagamento.criado',
            {
                pagamento_id: pagamento.id,
                reserva_id: pagamento.reserva_id,
                valor: pagamento.valor.toString(),
                tipo: pagamento.tipo,
                metodo: pagamento.metodo,
                status: pagamento.status,
            },
        );

        // Retorna o pagamento criado
        return pagamento;
    }

    // Busca todos os pagamentos de uma reserva específica
    async buscarPorReserva(reservaId: string) {
        return this.prisma.pagamento.findMany({
            where: {
                reserva_id: reservaId,
            },
            orderBy: {
                data_pagamento: 'desc',
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

        // Busca o pagamento atualizado
        const pagamentoAtualizado =
            await this.prisma.pagamento.findUnique({
                where: { id },
            });

        // Publica o evento de cancelamento no RabbitMQ
        if (pagamentoAtualizado) {
            await this.notificacoesService.publicarEvento(
                'pagamento.cancelado',
                {
                    pagamento_id: pagamentoAtualizado.id,
                    reserva_id: pagamentoAtualizado.reserva_id,
                    valor: pagamentoAtualizado.valor.toString(),
                    status: pagamentoAtualizado.status,
                },
            );
        }

        // Retorna o pagamento atualizado
        return pagamentoAtualizado;
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

        // Busca o pagamento atualizado após o estorno
        const pagamentoAtualizado =
            await this.prisma.pagamento.findUnique({
                where: { id },
            });

        // Publica o evento de estorno no RabbitMQ
        if (pagamentoAtualizado) {
            await this.notificacoesService.publicarEvento(
                'pagamento.estornado',
                {
                    pagamento_id: pagamentoAtualizado.id,
                    reserva_id: pagamentoAtualizado.reserva_id,
                    valor: pagamentoAtualizado.valor.toString(),
                    status: pagamentoAtualizado.status,
                },
            );
        }

        // Retorna o pagamento atualizado
        return pagamentoAtualizado;

    }



}
