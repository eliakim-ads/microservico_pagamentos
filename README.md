# Microserviço de Pagamentos — Sistema de Gestão Hoteleira

## 1. Sobre o projeto

Microserviço desenvolvido com **NestJS e TypeScript**, responsável pelo gerenciamento de pagamentos e faturas de reservas em um sistema de gestão hoteleira.

O projeto adota uma arquitetura de microserviços, na qual Pagamentos, Reservas e demais serviços são desenvolvidos de forma independente.

A integração com os demais microserviços ainda está em preparação. Está previsto o uso de um **API Gateway** como ponto de entrada do frontend. A forma de comunicação entre os microserviços será definida pela equipe.

**Escopo acadêmico:** os pagamentos, cancelamentos e estornos são registrados ou simulados no banco de dados. Não existe integração com adquirentes, instituições bancárias ou gateways financeiros. Portanto, não ocorre movimentação real de dinheiro.

## 2. Tecnologias utilizadas

- Node.js
- NestJS 11
- TypeScript
- Prisma ORM 6
- MySQL
- Swagger / OpenAPI 3.0 — documentação interativa da API
- Bruno — testes de endpoints
- Prisma Studio — inspeção dos registros
- Git e GitHub — controle de versionamento

## 3. Funcionalidades implementadas

### Pagamentos

- Cadastro e listagem de pagamentos.
- Geração automática de identificadores UUID.
- Associação lógica entre pagamento e reserva por meio de `reserva_id`.
- Validação dos campos recebidos por DTO.
- Validação dos tipos e métodos de pagamento.
- Restrição de cartão de crédito para pagamentos do tipo SINAL e TOTAL.
- Persistência dos registros no MySQL.
- Criação de pagamentos com status inicial `PENDENTE`.
- Cancelamento de pagamentos pendentes sem estorno.
- Estorno simulado de pagamentos aprovados.
- Bloqueio de operações incompatíveis com o status atual.
- Tratamento de erros HTTP.

### Faturas

- Emissão de faturas para pagamentos do tipo SALDO com status `APROVADO`.
- Geração de UUID e código identificador da fatura.
- Associação da fatura ao pagamento.
- Registro do valor do pagamento.
- Apresentação do valor total da reserva na resposta de emissão, quando informado.
- Bloqueio de emissão duplicada para o mesmo pagamento.
- Cancelamento de faturas emitidas.
- Validação das regras de emissão e cancelamento.

**Observação:** o valor total da reserva é atualmente recebido na requisição e apresentado na resposta da API. Esse campo não é persistido na tabela `fatura`, devido às restrições de alteração da estrutura do banco MySQL disponibilizado para o projeto.

### Documentação

- Configuração do Swagger.
- Organização dos endpoints nas categorias Pagamentos e Faturas.
- Documentação dos parâmetros, exemplos de requisição e respostas HTTP.
- Possibilidade de testar os endpoints diretamente pela interface Swagger.

## 4. Regras de negócio

### Tipos de pagamento

| Tipo | Descrição |
|---|---|
| SINAL | Pagamento de 30% do valor da reserva |
| TOTAL | Pagamento integral da reserva |
| SALDO | Pagamento do valor restante no checkout |

### Métodos permitidos

| Tipo | Métodos |
|---|---|
| SINAL | CREDITO |
| TOTAL | CREDITO |
| SALDO | CREDITO, DEBITO, PIX, DINHEIRO |

A conferência do valor exato de 30%, 100% ou do saldo restante dependerá da integração com o microserviço de Reservas.

O mock de Reservas utilizado durante o desenvolvimento foi removido após revisão acadêmica.

### Cancelamento e estorno

| Operação | Status exigido | Novo status |
|---|---|---|
| Cancelamento sem estorno | PENDENTE | CANCELADO |
| Estorno simulado | APROVADO | ESTORNADO |

As operações rejeitam pagamentos com status incompatível, inclusive tentativas repetidas.

O estorno não representa devolução financeira real.

### Emissão de faturas

Uma fatura somente pode ser emitida quando:

1. O pagamento existe.
2. O pagamento é do tipo `SALDO`.
3. O pagamento possui status `APROVADO`.
4. Ainda não existe fatura associada ao pagamento.

A tentativa de emitir uma segunda fatura para o mesmo pagamento retorna **409 Conflict**.

### Cancelamento de faturas

O cancelamento é permitido para faturas com status `EMITIDA`, alterando seu status para `CANCELADA`.

## 5. Estrutura do microserviço

```text
src/
├── fatura/
│   ├── fatura.controller.ts
│   ├── fatura.module.ts
│   ├── fatura.service.ts
│   └── fatura-validator.service.ts
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
```

### Responsabilidades

- **PagamentoController:** disponibiliza os endpoints HTTP de pagamentos.
- **PagamentoService:** coordena as operações de pagamentos e a persistência.
- **PagamentoValidatorService:** centraliza as validações das regras de pagamento.
- **CreatePagamentoDto:** define e valida os dados de criação.
- **FaturaController:** disponibiliza os endpoints HTTP de faturas.
- **FaturaService:** coordena emissão, cancelamento e persistência das faturas.
- **FaturaValidatorService:** valida as regras de emissão e cancelamento.
- **PrismaService:** disponibiliza o acesso ao MySQL.

## 6. Endpoints disponíveis

### Pagamentos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/pagamentos` | Lista os pagamentos cadastrados |
| POST | `/pagamentos` | Cadastra um pagamento |
| PATCH | `/pagamentos/:id/cancelar` | Cancela um pagamento pendente |
| PATCH | `/pagamentos/:id/estornar` | Simula o estorno de um pagamento aprovado |

### Faturas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/faturas` | Emite uma fatura |
| PATCH | `/faturas/:id/cancelar` | Cancela uma fatura emitida |

O parâmetro `:id` representa o UUID do registro correspondente.

### Exemplo — Criar pagamento

**POST `/pagamentos`**

```json
{
  "reserva_id": "550e8400-e29b-41d4-a716-446655440002",
  "valor": 600,
  "tipo": "SINAL",
  "metodo": "CREDITO"
}
```

**Resposta esperada: 201 Created**

```json
{
  "id": "6693dbce-fd12-4dea-ad8f-c3dc3b87516a",
  "reserva_id": "550e8400-e29b-41d4-a716-446655440002",
  "valor": "600",
  "tipo": "SINAL",
  "metodo": "CREDITO",
  "status": "PENDENTE",
  "data_pagamento": "2026-11-06T20:39:09.000Z"
}
```

### Exemplo — Emitir fatura

**POST `/faturas`**

```json
{
  "pagamento_id": "c747b217-051c-4148-9eb8-67d1d7ff6221",
  "valor_total_reserva": 1000
}
```

**Resposta observada: 201 Created**

```json
{
  "id": "11fdcea1-6c61-4ad0-b430-2f01be6ac51c",
  "codigo": "63614643-af1b-402d-bf76-d0c6bbd2f067",
  "pagamento_id": "c747b217-051c-4148-9eb8-67d1d7ff6221",
  "valor": "700",
  "status": "EMITIDA",
  "data_emissao": "2026-11-16T00:58:28.000Z",
  "valor_total_reserva": 1000
}
```

Nesse exemplo:

- Valor total da reserva: **R$ 1.000,00**.
- Valor do pagamento SALDO: **R$ 700,00**.
- Status da fatura: **EMITIDA**.

O campo `valor_total_reserva` é apresentado na resposta, mas não armazenado na tabela de faturas.

### Respostas HTTP

| Código | Significado |
|---|---|
| 200 OK | Consulta, cancelamento ou estorno realizado com sucesso |
| 201 Created | Pagamento ou fatura criado com sucesso |
| 400 Bad Request | Dados inválidos ou operação não permitida |
| 404 Not Found | Pagamento ou fatura não encontrado |
| 409 Conflict | Já existe uma fatura para o pagamento informado |

## 7. Status dos registros

### Pagamentos

| Status | Significado |
|---|---|
| PENDENTE | Pagamento registrado e aguardando processamento |
| APROVADO | Pagamento aprovado |
| RECUSADO | Pagamento recusado |
| CANCELADO | Pagamento cancelado sem estorno |
| ESTORNADO | Estorno registrado de forma simulada |

Novos pagamentos são criados com status `PENDENTE`.

A aprovação automática e a integração com um provedor financeiro ainda não foram implementadas. Durante os testes acadêmicos, alguns registros tiveram seus status alterados manualmente no Prisma Studio.

### Faturas

| Status | Significado |
|---|---|
| EMITIDA | Fatura emitida |
| CANCELADA | Fatura cancelada |

## 8. Instalação e execução

### Pré-requisitos

- Node.js e npm instalados.
- Acesso a um banco MySQL compatível.
- Variáveis de ambiente configuradas.

### Instalar dependências

```bash
npm install
```

### Configurar o banco de dados

Crie um arquivo `.env` na raiz do projeto e configure a variável:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:3306/NOME_DO_BANCO"
```

Substitua os valores de exemplo pelas credenciais do ambiente.

**Segurança:** não versione o arquivo `.env` nem compartilhe credenciais de acesso.

### Gerar o Prisma Client

```bash
npx prisma generate
```

### Compilar o projeto

```bash
npm run build
```

### Iniciar em desenvolvimento

```bash
npm run start:dev
```

A API estará disponível, por padrão, em:

`http://localhost:3000`

### Acessar o Swagger

Abra no navegador:

`http://localhost:3000/api`

A interface permite consultar a documentação e executar requisições de teste.

### Acessar o Prisma Studio

```bash
npx prisma studio
```

Alterações realizadas no Prisma Studio afetam diretamente o banco configurado.

**Atenção:** o usuário do banco MySQL acadêmico possui restrições para comandos de alteração de tabelas. Tentativas de modificar o esquema podem resultar em erros de permissão.

## 9. Testes realizados

Os endpoints foram testados utilizando Bruno e Swagger.

| Cenário | Resultado observado |
|---|---|
| Listagem de pagamentos | 200 OK |
| Criação de pagamento válido | 201 Created |
| Tentativa de SINAL com PIX | 400 Bad Request |
| Consulta de registros persistidos | 200 OK |
| Cancelamento de pagamento PENDENTE | 200 OK |
| Segunda tentativa de cancelamento | 400 Bad Request |
| Estorno de pagamento PENDENTE | 400 Bad Request |
| Estorno simulado de pagamento APROVADO | 200 OK |
| Segunda tentativa de estorno | 400 Bad Request |
| Emissão de fatura para SALDO aprovado | 201 Created |
| Emissão duplicada de fatura | 409 Conflict |
| Listagem de pagamentos pelo Swagger | 200 OK |
| Compilação do projeto | Sem erros |

Também foram documentados os códigos HTTP dos endpoints de faturas e pagamentos no Swagger.

Os testes realizados não representam transações financeiras reais.

## 10. Refatoração e melhorias realizadas

Durante o desenvolvimento, o projeto passou pelas seguintes melhorias:

1. Separação das responsabilidades entre Controller, Service e Validator.
2. Remoção do `ReservaMockService` após revisão acadêmica.
3. Criação do `PagamentoValidatorService`.
4. Implementação das operações de cancelamento e estorno simulado.
5. Criação do módulo de faturas.
6. Implementação do `FaturaValidatorService`.
7. Implementação da emissão e do cancelamento de faturas.
8. Inclusão do valor total da reserva na resposta da emissão de fatura.
9. Configuração do Swagger com `@nestjs/swagger` compatível com NestJS 11.
10. Documentação dos endpoints, parâmetros e respostas HTTP.
11. Realização de testes positivos e negativos com Bruno e Swagger.

## 11. Integração prevista e funcionalidades pendentes

### Integração com Reservas e API Gateway

O frontend deverá acessar os microserviços por meio de um API Gateway.

Ainda será definido se a comunicação entre Pagamentos e Reservas também passará pelo Gateway ou ocorrerá por uma API interna.

Após a definição do contrato de integração, o microsserviço de Pagamentos deverá obter os dados necessários da reserva para validar os valores de SINAL, TOTAL e SALDO.

### Funcionalidades pendentes

- Integração com o microserviço de Reservas.
- Validação dos valores de pagamento com base nos dados reais da reserva.
- Integração com serviços extras.
- Processamento e aprovação ou recusa automática de pagamentos.
- Integração com provedores financeiros.
- Execução de estornos reais mediante confirmação do provedor.
- Prevenção de cobranças duplicadas.
- Obtenção automática do valor total da reserva para emissão da fatura.
- Persistência do valor total da reserva, caso seja necessária e autorizada uma alteração do banco.
- Definição e implementação do contrato de comunicação com o API Gateway.

## 12. Considerações finais

O microsserviço disponibiliza funcionalidades de cadastro, listagem, cancelamento e estorno simulado de pagamentos, além de emissão e cancelamento de faturas.

A documentação interativa foi disponibilizada por meio do Swagger, permitindo consultar e testar os endpoints HTTP.

A separação entre Controllers, Services e Validators facilita a manutenção, a organização das regras de negócio e a futura integração com os demais componentes do sistema hoteleiro.

O projeto permanece em desenvolvimento acadêmico e **não realiza transações financeiras reais**.