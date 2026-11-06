// Service responsável por gerenciar os pagamentos

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PagamentoValidatorService } from './pagamento-validator.service';

@Injectable()
export class PagamentoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagamentoValidator: PagamentoValidatorService,
    ) {}

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
}
