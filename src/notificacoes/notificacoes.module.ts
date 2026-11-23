
import { Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { NotificacoesService } from './notificacoes.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_NOTIFICACOES',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ??
              'amqp://pagamentos:PagamentosDev2026@localhost:5672',
          ],
          queue: 'notificacoes_pagamentos',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [NotificacoesService],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}
