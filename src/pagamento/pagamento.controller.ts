// Controller será responsável por lidar com as requisições relacionadas a pagamentos.
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Controller('pagamentos')
export class PagamentoController {
  constructor(
    private readonly pagamentoService: PagamentoService,
  ) {}

  // GET /pagamentos - Lista todos os pagamentos
  @Get()
  async listarPagamentos() {
    return this.pagamentoService.listarPagamentos();
  }

  // POST /pagamentos - Cria um novo pagamento
  @Post()
  async criarPagamento(@Body() dados: CreatePagamentoDto) {
    return this.pagamentoService.criarPagamento(dados);
  }
}