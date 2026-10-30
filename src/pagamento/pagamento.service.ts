// Service responsável por gerenciar os pagamentos
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { ReservaMockService } from './reserva-mock.service';

@Injectable()
export class PagamentoService {
    constructor(private readonly prisma: PrismaService,
        private readonly reservaMockService: ReservaMockService,) { }

    // Lista todos os pagamentos cadastrados
    async listarPagamentos() {
        return this.prisma.pagamento.findMany();
    }

    // Cria um novo pagamento
    async criarPagamento(dados: CreatePagamentoDto) {

        // Verifica se o valor é válido
        if (
            typeof dados.valor !== 'number' ||
            !Number.isFinite(dados.valor) ||
            dados.valor <= 0
        ) {
            throw new BadRequestException(
                'O valor do pagamento deve ser um número maior que zero.',
            );
        }

        // Verifica o tipo de pagamento
        if (!['SINAL', 'TOTAL', 'SALDO'].includes(dados.tipo)) {
            throw new BadRequestException('Tipo de pagamento inválido.');
        }

        // Verifica o método de pagamento
        if (!['CREDITO', 'DEBITO', 'PIX', 'DINHEIRO'].includes(dados.metodo)) {
            throw new BadRequestException('Método de pagamento inválido.');
        }

        // SINAL e TOTAL somente por cartão de crédito
        if (
            ['SINAL', 'TOTAL'].includes(dados.tipo) &&
            dados.metodo !== 'CREDITO'
        ) {
            throw new BadRequestException(
                'Pagamentos do tipo SINAL ou TOTAL devem utilizar cartão de crédito.',
            );
        }
        // Inicio da simulação de reserva       
        // Consulta a reserva simulada
        const reserva = this.reservaMockService.buscarReserva(
            dados.reserva_id,
        );

        // Calcula o valor esperado para SINAL ou TOTAL
        let valorEsperado: number | null = null;

        if (dados.tipo === 'SINAL') {
            valorEsperado = Math.round(reserva.valorTotal * 30) / 100;
        }

        if (dados.tipo === 'TOTAL') {
            valorEsperado = reserva.valorTotal;
        }

        // Calcula o saldo restante no checkout
        if (dados.tipo === 'SALDO') {

            // Busca os pagamentos aprovados da reserva
            const pagamentosAprovados = await this.prisma.pagamento.findMany({
                where: {
                    reserva_id: dados.reserva_id,
                    status: 'APROVADO',
                },
                select: {
                    valor: true,
                },
            });

            // Soma os valores aprovados em centavos
            const totalPagoCentavos = pagamentosAprovados.reduce(
                (total, pagamento) =>
                    total + Math.round(pagamento.valor.toNumber() * 100),
                0,
            );

            // Calcula o saldo restante
            const totalReservaCentavos = Math.round(reserva.valorTotal * 100);
            const saldoCentavos = totalReservaCentavos - totalPagoCentavos;

            if (saldoCentavos <= 0) {
                throw new BadRequestException(
                    'Esta reserva não possui saldo pendente.',
                );
            }

            valorEsperado = saldoCentavos / 100;
        }



        // Compara os valores em centavos
        if (
            valorEsperado !== null &&
            Math.round(dados.valor * 100) !== Math.round(valorEsperado * 100)
        ) {
            throw new BadRequestException(
                `Valor incorreto para ${dados.tipo}. ` +
                `O valor esperado é R$ ${valorEsperado.toFixed(2)}.`,
            );
        }
        //fim da simulação de reserva

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