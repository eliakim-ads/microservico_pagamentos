<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).



# Microserviço de Pagamentos — Sistema de Gestão Hoteleira

## 1. Sobre o projeto

Microserviço desenvolvido em NestJS e TypeScript, responsável pelo gerenciamento de pagamentos de reservas em um sistema de gestão hoteleira.

O projeto utiliza arquitetura de microserviços, permitindo que os serviços de Pagamentos, Reservas e demais funcionalidades sejam desenvolvidos de maneira independente e integrados posteriormente.

## 2. Tecnologias utilizadas

- Node.js
- NestJS
- TypeScript
- Prisma ORM 6
- MySQL
- Bruno — testes de API
- Git e GitHub — controle de versionamento

## 3. Funcionalidades implementadas

- Cadastro de pagamentos.
- Listagem de pagamentos cadastrados.
- Geração automática de UUID.
- Associação de pagamentos a reservas por meio de `reserva_id`.
- Validação dos dados recebidos pela API.
- Validação dos tipos e métodos de pagamento.
- Restrição de cartão de crédito para pagamentos do tipo SINAL e TOTAL.
- Persistência dos pagamentos no MySQL.
- Status inicial PENDENTE para novos pagamentos.

## 4. Regras de negócio

O microserviço trabalha com três tipos de pagamento:

| Tipo | Descrição |
|---|---|
| SINAL | Pagamento de 30% do valor da reserva |
| TOTAL | Pagamento integral da reserva |
| SALDO | Pagamento do valor restante no checkout |

**Métodos de pagamento permitidos:**

- SINAL: cartão de crédito.
- TOTAL: cartão de crédito.
- SALDO: crédito, débito, PIX ou dinheiro.

**Observação:** a conferência dos valores de 30%, 100% e saldo restante depende da integração com o microserviço de Reservas e ainda não está implementada.

## 5. Estrutura do microserviço

```text
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
```

### Responsabilidades

**PagamentoController:** recebe as requisições HTTP e encaminha as operações ao serviço.

**PagamentoService:** coordena a criação e a consulta dos pagamentos, utilizando o Prisma para acessar o banco de dados.

**PagamentoValidatorService:** concentra as validações das regras de negócio.

**CreatePagamentoDto:** define os campos e as validações dos dados recebidos.

**PrismaService:** disponibiliza a conexão com o banco de dados MySQL.

## 6. Endpoints disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/pagamentos` | Lista os pagamentos |
| POST | `/pagamentos` | Cadastra um pagamento |

### Exemplo de requisição POST

```json
{
  "reserva_id": "550e8400-e29b-41d4-a716-446655440002",
  "valor": 600,
  "tipo": "SINAL",
  "metodo": "CREDITO"
}
```

### Exemplo de resposta

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

## 7. Status de pagamento

O banco de dados contempla os seguintes status:

- PENDENTE
- APROVADO
- RECUSADO
- CANCELADO
- ESTORNADO

Atualmente, novos pagamentos são registrados com status PENDENTE. O processamento e a atualização automática dos status ainda não foram implementados.

## 8. Instalação e execução

### Instalar as dependências

```bash
npm install
```

### Configurar o banco de dados

Criar o arquivo `.env` na raiz do projeto e configurar a variável `DATABASE_URL` com as credenciais do MySQL.

Não versionar o arquivo `.env`.

### Gerar o Prisma Client

```bash
npx prisma generate
```

### Compilar o projeto

```bash
npm run build
```

### Iniciar a aplicação

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## 9. Testes realizados

Os testes foram executados utilizando o Bruno.

| Cenário | Resultado |
|---|---|
| Listagem de pagamentos | 200 OK |
| Criação de pagamento válido | 201 Created |
| Tentativa de SINAL com PIX | 400 Bad Request |
| Consulta de pagamento persistido | 200 OK |
| Compilação após refatoração | Sem erros |

## 10. Refatoração realizada

Após revisão acadêmica, o microserviço passou por uma refatoração para melhorar a separação de responsabilidades.

Principais alterações:

1. Remoção do `ReservaMockService`, que simulava informações de reservas.
2. Criação do `PagamentoValidatorService`, responsável pelas regras de validação.
3. Simplificação do `PagamentoService`, mantendo a criação e consulta de pagamentos.
4. Atualização do `PagamentoModule` para registrar o novo serviço de validação.
5. Realização de testes para verificar o funcionamento após as alterações.

## 11. Funcionalidades pendentes

- Integração com o microserviço de Reservas.
- Validação dos valores de SINAL, TOTAL e SALDO com dados reais da reserva.
- Integração com serviços extras.
- Processamento simulado de pagamentos.
- Atualização do status dos pagamentos.
- Emissão de faturas.
- Tratamento de pagamentos duplicados.
- Implementação das regras de estorno e cancelamento.

## 12. Considerações finais

O microserviço de Pagamentos possui funcionalidades básicas de cadastro, consulta, validação e persistência implementadas e testadas.

A refatoração realizada contribuiu para a organização do código e para a manutenção independente das regras de negócio.

O projeto encontra-se em desenvolvimento acadêmico e ainda não realiza transações financeiras reais.