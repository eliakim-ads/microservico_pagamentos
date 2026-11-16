
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FaturaValidatorService {

  // Valida se o pagamento permite a emissão de fatura
  validarEmissao(tipo: string, status: string): void {

    if (tipo !== 'SALDO') {
      throw new BadRequestException(
        'A fatura só pode ser emitida para pagamentos do tipo SALDO.',
      );
    }

    if (status !== 'APROVADO') {
      throw new BadRequestException(
        'A fatura só pode ser emitida para pagamentos com status APROVADO.',
      );
    }
  }

  // Valida se a fatura pode ser cancelada
  validarCancelamento(status: string): void {

    if (status !== 'EMITIDA') {
      throw new BadRequestException(
        'Somente faturas com status EMITIDA podem ser canceladas.',
      );
    }
  }
}
