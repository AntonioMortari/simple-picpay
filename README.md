
# Desafio Backend PicPay

API para a plataforma de pagamentos PicPay Simplificado, permitindo transferências entre usuários comuns e lojistas.


## Tecnologias Utilizadas

- NestJS
- NodeJs
- Typescript
- Docker
- Jest
- PostgreeSQL
- Prisma
- JWT


## Estrutura do projeto

![Estrutura do projeto](https://github.com/user-attachments/assets/dd3e9068-1bdf-4008-be33-3c43b32d6438)
## Funcionalidades

- Login e cadastro de usuários
- Usuários comuns podem fazer transferências
- Usuários lojistas podem apenas receber transferências
- Usuários não podem realizar uma transferência sem saldo
- Consulta á uma API externa antes de realizar a transferência


## Instalação

```bash
# clonar o repositório
git clone https://github.com/AntonioMortari/simple-picpay.git

# instalar as dependências
npm install

# adicionar as variáveis de ambiente

# iniciar o container docker
docker-compose up -d

# compilar o código
npm run build

# executar o projeto
npm start
```
    
## Testes Unitários

Para rodar os testes, execute o seguinte comando:

```bash
  npm run test
```

![Testes unitários](https://github.com/user-attachments/assets/b255adb9-f712-419e-aba1-db8b7cad51ab)


## Desafio:

 - [Desafio PicPay](https://github.com/PicPay/picpay-desafio-backend)


