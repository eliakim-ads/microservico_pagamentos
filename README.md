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

## Sobre o projeto

Microserviço responsável pelo gerenciamento de pagamentos de reservas de um sistema de gestão hoteleira.

Desenvolvido como parte do Projeto Integrador V, utilizando arquitetura de microserviços.

## Tecnologias utilizadas

- Node.js
- NestJS
- TypeScript
- Prisma ORM 6
- MySQL
- Bruno (testes de API)
- Git e GitHub

## Funcionalidades implementadas

- Cadastro de pagamentos vinculados a reservas.
- Consulta de pagamentos cadastrados.
- Geração automática de identificadores UUID.
- Validação dos dados recebidos pela API.
- Cálculo do sinal de 30% sobre o valor da reserva.
- Validação de pagamento integral (100%).
- Restrição de cartão de crédito para SINAL e TOTAL.
- Persistência de dados no MySQL.
- Simulação temporária de reservas para testes.

## Regras de negócio

### Pagamento de sinal
O cliente poderá pagar 30% do valor da reserva, exclusivamente com cartão de crédito.

### Pagamento integral
O cliente poderá pagar 100% do valor da reserva, exclusivamente com cartão de crédito.

### Pagamento do saldo
O saldo restante poderá ser pago no checkout utilizando:
- Crédito
- Débito
- PIX
- Dinheiro

A implementação e os testes completos do cálculo do saldo estão em andamento.

## Endpoints implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /pagamentos | Lista os pagamentos cadastrados |
| POST | /pagamentos | Cria um pagamento com validações |

## Exemplo de requisição

POST /pagamentos

```json
{
  "reserva_id": "550e8400-e29b-41d4-a716-446655440000",
  "valor": 300.00,
  "tipo": "SINAL",
  "metodo": "CREDITO"
}
```

## Status dos pagamentos

- PENDENTE
- APROVADO
- RECUSADO
- CANCELADO
- ESTORNADO

## Como executar

Instalar as dependências:

```bash
npm install
```

Configurar a variável `DATABASE_URL` no arquivo `.env`, utilizando as credenciais do banco MySQL.

Gerar o Prisma Client:

```bash
npx prisma generate
```

Iniciar o servidor:

```bash
npm run start:dev
```

A API estará disponível em:

http://localhost:3000

## Testes

As requisições foram testadas utilizando o Bruno.

Cenários validados:
- Listagem de pagamentos.
- Cadastro de SINAL válido.
- Rejeição de SINAL com valor incorreto.
- Cadastro de TOTAL válido.
- Rejeição de TOTAL com valor incorreto.
- Rejeição de PIX para SINAL.
- Rejeição de débito para TOTAL.

## Funcionalidades em desenvolvimento

- Cálculo e validação do saldo no checkout.
- Integração com o microserviço de reservas.
- Inclusão de serviços extras no cálculo.
- Processamento simulado de pagamentos.
- Atualização do status de pagamentos.
- Emissão de faturas.
- Consultas e relatórios financeiros.
- Tratamento de pagamentos duplicados.

## Observações

Atualmente, os dados das reservas são simulados por meio do ReservaMockService.

O banco MySQL armazena os pagamentos, enquanto a integração com os demais microserviços será implementada posteriormente.

Este projeto é acadêmico e não realiza transações financeiras reais.
