// O serviço de validação de pagamento é responsável por verificar 
// se os dados do pagamento estão corretos e atendem às regras de negócio definidas.
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Injectable()
export class PagamentoValidatorService {

    // Valida as regras de negócio do pagamento
    validarPagamento(dados: CreatePagamentoDto): void {

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
            throw new BadRequestException(
                'Tipo de pagamento inválido.',
            );
        }

        // Verifica o método de pagamento
        if (!['CREDITO', 'DEBITO', 'PIX', 'DINHEIRO'].includes(dados.metodo)) {
            throw new BadRequestException(
                'Método de pagamento inválido.',
            );
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
    }
}
