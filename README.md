Microserviço de Pagamentos — Sistema de Gestão Hoteleira
1. Sobre o projeto
Microserviço desenvolvido em NestJS e TypeScript, responsável pelo gerenciamento de pagamentos de reservas em um sistema de gestão hoteleira.

O projeto adota uma arquitetura de microserviços, na qual Pagamentos, Reservas e demais serviços são desenvolvidos de forma independente. A integração com os demais serviços ainda está em preparação. Está previsto o uso de um API Gateway como ponto de entrada do frontend; a forma de comunicação entre os próprios microserviços ainda será definida pela equipe.
Escopo acadêmico: os pagamentos e estornos atualmente são registrados/simulados no banco de dados. Não há integração com adquirente, banco ou gateway financeiro e não ocorre movimentação real de dinheiro.

2. Tecnologias utilizadas
- Node.js
- NestJS
- TypeScript
- Prisma ORM 6
- MySQL
- Bruno — testes de API
- Git e GitHub — controle de versionamento
3. Funcionalidades implementadas
- Cadastro de pagamentos e listagem dos registros existentes.
- Geração automática de UUID para cada pagamento.
- Associação lógica à reserva por meio de reserva_id, sem chave estrangeira entre microserviços.
- Validação dos dados recebidos e dos tipos e métodos de pagamento.
- Restrição de cartão de crédito para pagamentos SINAL e TOTAL.
- Persistência no MySQL, com status inicial PENDENTE.
- Cancelamento sem estorno de pagamentos pendentes.
- Estorno simulado de pagamentos aprovados.
- Bloqueio de cancelamentos e estornos repetidos ou incompatíveis com o status atual.
- Tratamento de pagamento inexistente (404) e de operação não permitida (400).
4. Regras de negócio
Tipos de pagamento
Tipo	Descrição
SINAL	Pagamento de 30% do valor da reserva
TOTAL	Pagamento integral da reserva
SALDO	Pagamento do valor restante no checkout


Métodos permitidos
Tipo	Métodos
SINAL	CREDITO
TOTAL	CREDITO
SALDO	CREDITO, DEBITO, PIX, DINHEIRO


Limitação atual: a conferência do valor exato de 30%, 100% ou do saldo restante depende dos dados fornecidos pelo microserviço de Reservas e ainda não está implementada. O mock de Reservas foi removido após revisão acadêmica.
Cancelamento e estorno
Operação	Status exigido	Novo status	Efeito
Cancelamento sem estorno	PENDENTE	CANCELADO	Atualização do registro, sem devolução financeira
Estorno simulado	APROVADO	ESTORNADO	Atualização do registro, sem devolução financeira real


As operações rejeitam pagamentos com status incompatível, inclusive tentativas repetidas. A atualização é condicionada ao status esperado, evitando modificar um registro cujo status tenha mudado durante a operação.

Importante: o endpoint de estorno não executa um reembolso real. Em uma futura integração financeira, a confirmação da devolução pelo provedor deverá anteceder a confirmação do estorno no sistema.
5. Estrutura do microserviço
src/
├── pagamento/
│   ├── dto/
│   │   └── create-pagamento.dto.ts
│   ├── pagamento.controller.ts
│   ├── pagamento.module.ts
│   ├── pagamento.service.ts
│   └── pagamento-validator.service.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts
└── main.ts
Responsabilidades
- PagamentoController: expõe os endpoints HTTP e encaminha as solicitações ao serviço.
- PagamentoService: coordena consultas, criação, cancelamento, estorno simulado e persistência via Prisma.
- PagamentoValidatorService: concentra as regras de validação, inclusive as permissões de cancelamento e estorno por status.
- CreatePagamentoDto: define e valida os campos recebidos na criação.
- PrismaService: disponibiliza acesso ao MySQL.
6. Endpoints disponíveis
Método	Endpoint	Descrição
GET	/pagamentos	Lista pagamentos
POST	/pagamentos	Cadastra um pagamento
PATCH	/pagamentos/:id/cancelar	Cancela um pagamento PENDENTE sem estorno
PATCH	/pagamentos/:id/estornar	Simula o estorno de um pagamento APROVADO


O parâmetro :id é o UUID do pagamento. As operações PATCH não exigem corpo (Body).
Exemplo de criação — POST /pagamentos
{
  "reserva_id": "550e8400-e29b-41d4-a716-446655440002",
  "valor": 600,
  "tipo": "SINAL",
  "metodo": "CREDITO"
}
Exemplo de resposta (201 Created):
{
  "id": "6693dbce-fd12-4dea-ad8f-c3dc3b87516a",
  "reserva_id": "550e8400-e29b-41d4-a716-446655440002",
  "valor": "600",
  "tipo": "SINAL",
  "metodo": "CREDITO",
  "status": "PENDENTE",
  "data_pagamento": "2026-11-06T20:39:09.000Z"
}
Cancelamento sem estorno
PATCH /pagamentos/6693dbce-fd12-4dea-ad8f-c3dc3b87516a/cancelar
Se o pagamento estiver PENDENTE, a API retorna 200 OK com o registro atualizado para CANCELADO. Se não estiver pendente, retorna 400 Bad Request.
Estorno simulado
PATCH /pagamentos/ec037a25-eab8-4cb0-ae1e-ebd0b48f9279/estornar
Se o pagamento estiver APROVADO, a API retorna 200 OK com o registro atualizado para ESTORNADO. Caso contrário, retorna 400 Bad Request.

Exemplo de erro de estorno não permitido:
{
  "message": "Somente pagamentos com status APROVADO podem ser estornados.",
  "error": "Bad Request",
  "statusCode": 400
}
Para pagamentos não encontrados, os métodos de cancelamento e estorno retornam 404 Not Found. UUIDs em formato inválido são rejeitados pela validação da rota.
7. Status de pagamento
Status	Significado
PENDENTE	Pagamento registrado, aguardando processamento
APROVADO	Pagamento aprovado
RECUSADO	Pagamento recusado
CANCELADO	Pagamento pendente cancelado sem estorno
ESTORNADO	Estorno registrado de forma simulada


Novos pagamentos são criados com status PENDENTE. A aprovação automática e a integração com um provedor de pagamento ainda não foram implementadas. Para o teste positivo do estorno, o status de um registro de teste foi alterado manualmente para APROVADO no Prisma Studio.
8. Instalação e execução
Instalar dependências
npm install
Configurar o banco
Crie um arquivo .env na raiz do projeto e configure a variável DATABASE_URL com os dados de acesso ao MySQL. Não versione o .env nem compartilhe credenciais.
Gerar o Prisma Client
npx prisma generate
Compilar
npm run build
Iniciar em desenvolvimento
npm run start:dev
Por padrão, a API estará disponível em http://localhost:3000.
Inspecionar os dados com Prisma Studio
npx prisma studio
Use o Prisma Studio com cautela: alterações realizadas nele afetam diretamente o banco configurado.
9. Testes realizados no Bruno
Cenário	Resultado observado
Listagem de pagamentos	200 OK
Criação de pagamento válido	201 Created
Tentativa de SINAL com PIX	400 Bad Request
Consulta de pagamento persistido	200 OK
Cancelamento de pagamento PENDENTE	200 OK e status CANCELADO
Segunda tentativa de cancelamento	400 Bad Request
Estorno de pagamento PENDENTE	400 Bad Request
Estorno simulado de pagamento APROVADO	200 OK e status ESTORNADO
Segunda tentativa de estorno	400 Bad Request
Compilação após implementação das operações	Sem erros


Os testes de cancelamento e estorno foram realizados com registros de teste no MySQL. Não representam operações financeiras reais.
10. Refatoração realizada
Após revisão acadêmica, o projeto foi reorganizado para separar responsabilidades:
1. Remoção do ReservaMockService.
2. Criação do PagamentoValidatorService para centralizar as validações.
3. Simplificação do PagamentoService para coordenar operações e persistência.
4. Atualização do PagamentoModule para registrar o serviço de validação.
5. Inclusão das operações de cancelamento sem estorno e estorno simulado, com validações separadas.
6. Testes das regras e dos endpoints no Bruno.
11. Integração prevista e funcionalidades pendentes
Integração com Reservas e API Gateway
O frontend deverá acessar os microserviços por meio de um API Gateway. Ainda será definido se a comunicação necessária entre Pagamentos e Reservas também passará pelo Gateway ou ocorrerá por uma API interna.

Quando o contrato de integração estiver definido, Pagamentos deverá obter os dados necessários da reserva para conferir o valor do SINAL, do TOTAL e do SALDO, sem recriar um mock de Reservas.
Funcionalidades pendentes
- Integração com o microserviço de Reservas.
- Validação do valor de SINAL, TOTAL e SALDO a partir dos dados reais da reserva.
- Integração com serviços extras.
- Processamento e aprovação/recusa de pagamentos.
- Integração financeira para estornos reais, incluindo confirmação do provedor.
- Emissão de faturas.
- Tratamento de pagamentos duplicados e prevenção de cobranças repetidas.
- Definição do contrato de comunicação e da configuração do API Gateway.
12. Considerações finais
O microserviço já disponibiliza cadastro, listagem, validações, persistência, cancelamento sem estorno e estorno simulado, com cenários positivos e negativos testados no Bruno.

A separação entre Controller, Service e Validator facilita a manutenção e a futura integração com os demais componentes do sistema hoteleiro. O projeto permanece em desenvolvimento acadêmico e não processa transações financeiras reais.