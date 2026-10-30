// Classe de serviço criada para simular a busca de reservas em um banco de dados.
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReservaMockService {
  private readonly reservas = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      valorTotal: 1000.00,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      valorTotal: 1500.00,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      valorTotal: 2000.00,
    },
  ];

  buscarReserva(reservaId: string) {
    const reserva = this.reservas.find(
      (item) => item.id === reservaId,
    );

    if (!reserva) {
      throw new NotFoundException(
        'Reserva não encontrada na simulação.',
      );
    }

    return reserva;
  }
}