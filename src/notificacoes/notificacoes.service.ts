
import {  Injectable,  Inject,  Logger,  OnModuleInit,  OnModuleDestroy,} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// onModuleInit() Conecta o cliente ao RabbitMQ na inicialização
//publicarEvento()	Publica um evento na fila
//rabbitClient.emit()	Envia uma mensagem assíncrona
//onModuleDestroy()	Encerra a conexão ao desligar a aplicação
@Injectable()
export class NotificacoesService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(NotificacoesService.name);

  constructor(
    @Inject('RABBITMQ_NOTIFICACOES')
    private readonly rabbitClient: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitClient.connect();
    this.logger.log('Conectado ao RabbitMQ com sucesso!');
  }

  async onModuleDestroy(): Promise<void> {
    await this.rabbitClient.close();
  }

  async publicarEvento(
    evento: string,
    dados: Record<string, unknown>,
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.rabbitClient.emit(evento, {
          evento,
          dados,
          data_hora: new Date().toISOString(),
        }),
      );

      this.logger.log(`Evento publicado: ${evento}`);
    } catch (error) {
      this.logger.error(
        `Erro ao publicar evento: ${evento}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
