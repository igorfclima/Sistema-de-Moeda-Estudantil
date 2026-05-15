# 🪙 Sistema de Moeda Estudantil 🎓

> [!NOTE]
> Plataforma educacional que incentiva o mérito acadêmico por meio de uma **moeda virtual** concedida por professores e resgatável em benefícios de empresas parceiras.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Sistema de Moeda Estudantil (SME)</b> é uma aplicação web full-stack que cria um <i>ecossistema de recompensas acadêmicas</i>. Professores reconhecem o esforço dos alunos enviando moedas virtuais, que podem ser trocadas por vantagens reais oferecidas por empresas parceiras — como descontos, brindes e serviços. O sistema conta com <b>quatro perfis de acesso</b>: Administrador, Professor, Aluno e Empresa Parceira, cada um com seu próprio dashboard e fluxo de trabalho. O projeto foi desenvolvido como trabalho acadêmico e segue boas práticas de engenharia de software, incluindo autenticação JWT, arquitetura em camadas, deploy em nuvem e seed de dados para testes.
      </div>
    </td>
    <td>
      <div align="center">
        <img src="https://img.icons8.com/fluency/120/coin.png" alt="Logo SME" width="110px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/igorfclima/Sistema-de-Moeda-Estudantil/releases)
![Java](https://img.shields.io/badge/Java-21-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-007ec6?style=for-the-badge&logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-007ec6?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-007ec6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-007ec6?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-007ec6?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-multi--stage-007ec6?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-007ec6?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-007ec6?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub license](https://img.shields.io/github/license/igorfclima/Sistema-de-Moeda-Estudantil?style=for-the-badge&color=007ec6&logo=opensourceinitiative)

---

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
    - [Pré-requisitos](#pré-requisitos)
    - [Variáveis de Ambiente](#-variáveis-de-ambiente)
    - [Instalação de Dependências](#-instalação-de-dependências)
    - [Inicialização do Banco de Dados](#-inicialização-do-banco-de-dados-postgresql)
    - [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações Utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 🔗 Links Úteis

- 🌐 **Demo Online (Frontend):** [sistema-merito.vercel.app](https://sistema-merito.vercel.app)
    > Aplicação hospedada na Vercel, conectada ao backend no Render.
- 🖥️ **API (Backend):** [sistema-merito-api.onrender.com](https://sistema-merito-api.onrender.com/actuator/health)
    > Endpoint de health-check para verificar se o serviço está ativo.
- 🔑 **Credenciais de Teste:** [`CREDENCIAIS_TESTE.md`](./CREDENCIAIS_TESTE.md)
    > Logins prontos para todos os perfis (Admin, Professor, Aluno, Empresa).

---

## 📝 Sobre o Projeto

O **Sistema de Moeda Estudantil** surgiu da necessidade de criar um mecanismo digital de incentivo ao mérito acadêmico. Em vez de reconhecimento apenas simbólico, o sistema permite que professores recompensem alunos com **moedas virtuais** que possuem valor real — trocáveis por benefícios tangíveis em empresas parceiras.

O projeto resolve três problemas simultâneos:

- **Para alunos:** uma forma concreta de ser reconhecido pelo esforço e obter benefícios reais.
- **Para professores:** uma ferramenta simples para distribuir cotas mensais de moedas com mensagem personalizada.
- **Para empresas parceiras:** um canal direto de atração de clientes qualificados (estudantes) por meio de vantagens exclusivas.

O sistema foi desenvolvido como **projeto acadêmico** seguindo boas práticas de engenharia de software: autenticação stateless com JWT, arquitetura em camadas (Controller → Service → Repository), deploy containerizado com Docker e integração contínua via Render e Vercel.

---

## ✨ Funcionalidades Principais

### 👨‍💼 Administrador

- 🏛️ **Gerenciar Instituições:** CRUD completo de instituições de ensino.
- 👨‍🏫 **Importar Professores via PDF:** Upload de lista de professores em PDF, com criação automática de contas e envio de credenciais por e-mail.
- 📊 **Dashboard com Estatísticas:** Visão geral do sistema (usuários, transações, saldo total).

### 👨‍🏫 Professor

- 💰 **Saldo de Moedas:** Visualizar cota mensal disponível para envio.
- 📤 **Enviar Moedas:** Transferir moedas para alunos com mensagem de reconhecimento.
- 📋 **Extrato de Transações:** Histórico completo de moedas enviadas.

### 🎓 Aluno

- 💳 **Saldo Atualizado:** Saldo de moedas em tempo real.
- 🛍️ **Resgatar Vantagens:** Trocar moedas por benefícios de empresas parceiras.
- 🎟️ **Cupons com Código Único:** Código de resgate gerado e exibido em popup, com botão de cópia.
- 📜 **Histórico de Resgates:** Tabela com data, vantagem, custo e cupom.
- 📈 **Extrato de Recebimentos:** Histórico de moedas recebidas de professores.

### 🏢 Empresa Parceira

- 🎁 **Cadastrar Vantagens:** Criar benefícios com nome, descrição, custo em moedas e foto.
- 📋 **Resgates Recebidos:** Tabela de todos os resgates realizados pelos alunos.
- ✅ **Validar Cupons:** Confirmar a autenticidade de um cupom pelo código único.

---

## 🛠 Tecnologias Utilizadas

### 🖥️ Back-end

| Tecnologia        | Versão               | Função                                |
| :---------------- | :------------------- | :------------------------------------ |
| Java              | 21                   | Linguagem principal                   |
| Spring Boot       | 4.0.6                | Framework web                         |
| Spring Security   | 4.0.6                | Autenticação e autorização            |
| Spring Data JPA   | 4.0.6                | ORM / Repositórios                    |
| Hibernate         | 7.x                  | Implementação JPA                     |
| PostgreSQL Driver | 42.x                 | Conexão com banco                     |
| jjwt              | 0.12.6               | Geração e validação de tokens JWT     |
| Flyway            | Gerenciado pelo Boot | Migrations do banco de dados          |
| PDFBox            | 2.0.29               | Leitura e geração de PDFs             |
| JavaMailSender    | Gerenciado pelo Boot | Envio de e-mails SMTP                 |
| Spring Actuator   | 4.0.6                | Health check para Render              |
| Maven             | 3.9                  | Gerenciamento de build e dependências |

### 💻 Front-end

| Tecnologia   | Versão | Função                       |
| :----------- | :----- | :--------------------------- |
| Next.js      | 16.2.6 | Framework React (App Router) |
| React        | 19.2.4 | Biblioteca de interface      |
| TypeScript   | 5.x    | Tipagem estática             |
| Tailwind CSS | 4.x    | Estilização utilitária       |
| React Icons  | 5.x    | Biblioteca de ícones         |

### ⚙️ Infraestrutura & DevOps

| Tecnologia                       | Função                                            |
| :------------------------------- | :------------------------------------------------ |
| Docker (multi-stage)             | Containerização do backend                        |
| Render                           | Hospedagem do backend (Docker) + banco PostgreSQL |
| Vercel                           | Hospedagem do frontend (Next.js)                  |
| Render Blueprint (`render.yaml`) | Provisionamento de infraestrutura como código     |

---

## 🏗 Arquitetura

O sistema é dividido em duas aplicações independentes que se comunicam via REST API:

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE                            │
│           Next.js + React (Vercel)                      │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  /admin   │ │/professor│ │  /aluno  │ │/empresa  │  │
│  └─────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└────────┼────────────┼────────────┼─────────────┼────────┘
         │            │  REST API  │             │
         └────────────┴─────┬──────┴─────────────┘
                            │ HTTPS / JWT
┌───────────────────────────▼─────────────────────────────┐
│                    BACKEND (Render)                      │
│              Spring Boot 4.0.6 + Docker                  │
│  ┌────────────┐  ┌───────────┐  ┌───────────────────┐   │
│  │ Controller │→ │  Service  │→ │    Repository     │   │
│  │  (REST)    │  │ (Negócio) │  │  (Spring Data JPA)│   │
│  └────────────┘  └───────────┘  └────────┬──────────┘   │
│                                          │               │
│  ┌────────────────────────────────────────▼──────────┐   │
│  │           PostgreSQL (Render Managed DB)          │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Padrões adotados:**

- **MVC em camadas:** Controller → Service → Repository
- **DTOs:** Toda comunicação externa usa Data Transfer Objects, nunca entidades JPA diretamente
- **Herança de tabela (JOINED):** `Transacao` é superclasse de `TransacaoEnvio` e `TransacaoResgate`
- **Herança de tabela (SINGLE_TABLE):** `Usuario` é superclasse de `Administrador`, `Professor`, `Aluno` e `EmpresaParceira`
- **Stateless JWT:** Sem sessão no servidor; token enviado no header `Authorization: Bearer <token>`
- **DataSeeder:** Popula dados de teste idempotentes no startup (upsert, nunca duplica)

---

## 🔧 Instalação e Execução

### Pré-requisitos

| Ferramenta    | Versão mínima      | Uso                                  |
| :------------ | :----------------- | :----------------------------------- |
| Java JDK      | 21                 | Executar o backend Spring Boot       |
| Node.js       | 18 LTS             | Executar o frontend Next.js          |
| PostgreSQL    | 14+                | Banco de dados relacional            |
| Docker        | Qualquer           | Alternativa para subir o banco local |
| Maven Wrapper | Incluso no projeto | Build do backend                     |

---

### 🔑 Variáveis de Ambiente

#### 1. Back-end (Spring Boot)

Configure em `backend/sistema-merito/src/main/resources/application.properties` ou via variáveis de ambiente do SO:

| Variável               | Descrição                                  | Padrão (dev)                |
| :--------------------- | :----------------------------------------- | :-------------------------- |
| `DB_HOST`              | Host do PostgreSQL                         | `localhost`                 |
| `DB_PORT`              | Porta do PostgreSQL                        | `5432`                      |
| `DB_NAME`              | Nome do banco de dados                     | `sistema_merito`            |
| `DB_USERNAME`          | Usuário do banco                           | `postgres`                  |
| `DB_PASSWORD`          | Senha do banco                             | `senha123`                  |
| `JWT_SECRET`           | Chave secreta para assinar tokens JWT      | valor padrão base64         |
| `JWT_EXPIRATION_MS`    | Expiração do token em ms                   | `86400000` (24h)            |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas (separadas por vírgula) | `http://localhost:3000`     |
| `MAIL_HOST`            | Host SMTP para envio de e-mails            | _(vazio)_                   |
| `MAIL_PORT`            | Porta SMTP                                 | `587`                       |
| `MAIL_USERNAME`        | Usuário SMTP                               | _(vazio)_                   |
| `MAIL_PASSWORD`        | Senha SMTP                                 | _(vazio)_                   |
| `MAIL_FROM`            | Remetente padrão                           | `noreply@sistemamerito.com` |
| `DDL_AUTO`             | Modo DDL do Hibernate                      | `update`                    |

#### 2. Front-end (Next.js)

Crie o arquivo `frontend/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Em produção (Vercel), configure:

```env
NEXT_PUBLIC_API_URL=https://sistema-merito-api.onrender.com
```

---

### 📦 Instalação de Dependências

**1. Clone o repositório:**

```bash
git clone https://github.com/igorfclima/Sistema-de-Moeda-Estudantil.git
cd Sistema-de-Moeda-Estudantil
```

**2. Dependências do Front-end:**

```bash
cd frontend/frontend
npm install
```

**3. Dependências do Back-end** (Maven Wrapper resolve automaticamente no `spring-boot:run`, mas para build explícito):

```bash
cd backend/sistema-merito
./mvnw clean install -DskipTests
```

---

### 💾 Inicialização do Banco de Dados (PostgreSQL)

**Opção A — Docker (recomendado):**

```bash
docker run --name sme-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=senha123 \
  -e POSTGRES_DB=sistema_merito \
  -p 5432:5432 \
  -d postgres:16
```

**Opção B — PostgreSQL local:**

```sql
CREATE DATABASE sistema_merito;
```

> [!NOTE]
> O Hibernate cria todas as tabelas automaticamente no primeiro startup (`DDL_AUTO=update`). O `DataSeeder` popula os dados de teste em seguida. Nenhuma migration manual é necessária.

---

### ⚡ Como Executar a Aplicação

Execute em **dois terminais separados**:

#### Terminal 1 — Back-end (Spring Boot)

```bash
cd backend/sistema-merito
./mvnw spring-boot:run
# Windows:
mvnw.cmd spring-boot:run
```

🚀 API disponível em `http://localhost:8080`

---

#### Terminal 2 — Front-end (Next.js)

```bash
cd frontend/frontend
npm run dev
```

🎨 Aplicação disponível em `http://localhost:3000`

---

## 🚀 Deploy

O sistema é implantado em duas plataformas distintas:

### Backend → Render

O arquivo [`render.yaml`](./render.yaml) na raiz do repositório define toda a infraestrutura:

- **Serviço web:** runtime Docker, imagem construída a partir de `backend/sistema-merito/Dockerfile`
- **Banco de dados:** PostgreSQL gerenciado pelo Render (plano free)
- **Variáveis de ambiente:** injetadas automaticamente via `fromDatabase` (host, porta, nome, usuário e senha separados)
- **Health check:** `/actuator/health`

```bash
# Build manual do JAR (apenas para referência — no Render o Docker cuida disso)
cd backend/sistema-merito
./mvnw clean package -DskipTests
java -jar target/sistema-merito-0.0.1-SNAPSHOT.jar
```

**Variáveis obrigatórias a configurar manualmente no painel do Render:**

| Variável               | Descrição                                                           |
| :--------------------- | :------------------------------------------------------------------ |
| `CORS_ALLOWED_ORIGINS` | URL do frontend no Vercel (ex: `https://sistema-merito.vercel.app`) |
| `MAIL_HOST`            | Servidor SMTP (ex: `smtp.gmail.com`)                                |
| `MAIL_USERNAME`        | Conta de e-mail                                                     |
| `MAIL_PASSWORD`        | Senha ou App Password                                               |

> [!IMPORTANT]
> As variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` e `JWT_SECRET` são provisionadas automaticamente pelo `render.yaml` — não é necessário configurá-las manualmente.

---

### Frontend → Vercel

1. Importe o repositório no painel da Vercel.
2. Configure **Root Directory** como `frontend/frontend`.
3. Adicione a variável de ambiente:

```
NEXT_PUBLIC_API_URL=https://sistema-merito-api.onrender.com
```

4. Clique em **Deploy**.

---

## 📂 Estrutura de Pastas

```
Sistema-de-Moeda-Estudantil/
│
├── render.yaml                          # 🐳 Blueprint Render (infra como código)
├── README.md                            # 📘 Documentação principal
├── CREDENCIAIS_TESTE.md                 # 🔑 Logins para testes
│
├── backend/
│   └── sistema-merito/
│       ├── Dockerfile                   # 🐳 Build multi-stage (Maven → JRE Alpine)
│       ├── pom.xml                      # 🛠️ Dependências Maven
│       └── src/main/java/com/merito/sistema_merito/
│           ├── config/
│           │   └── DataSeeder.java      # 🌱 Seed de dados de teste (idempotente)
│           ├── controller/              # 🎮 Endpoints REST
│           │   ├── AuthController.java
│           │   ├── AdminController.java
│           │   ├── AlunoController.java
│           │   ├── ProfessorController.java
│           │   ├── EmpresaParceiraController.java
│           │   ├── VantagemController.java
│           │   ├── InstituicaoController.java
│           │   └── ResgateController.java
│           ├── domain/
│           │   ├── entity/              # 🧬 Entidades JPA (Usuario, Aluno, Professor…)
│           │   ├── dto/                 # ✉️ Data Transfer Objects
│           │   └── enums/              # 📌 Enumerações (StatusVantagem, TipoNotificacao)
│           ├── exception/              # 💥 Exceptions e handler global (RestExceptionHandler)
│           ├── repository/             # 🗄️ Interfaces Spring Data JPA
│           ├── security/               # 🛡️ JWT, Spring Security, filtros
│           │   ├── JwtService.java
│           │   ├── JwtAuthenticationFilter.java
│           │   └── SecurityConfig.java
│           ├── service/                # ⚙️ Regras de negócio
│           │   ├── ServicoAluno.java
│           │   ├── ServicoProfessor.java
│           │   ├── ServicoMoeda.java
│           │   ├── ServicoResgate.java
│           │   ├── ServicoEmpresaParceira.java
│           │   ├── ServicoEmail.java
│           │   └── PdfService.java
│           └── SistemaMeritoApplication.java
│
└── frontend/
    └── frontend/
        ├── .env.local                   # 🔒 URL da API local (não versionado)
        ├── .env.example                 # 🧩 Exemplo de variáveis de ambiente
        ├── next.config.ts               # ⚙️ Configuração Next.js (remotePatterns)
        ├── package.json                 # 📦 Dependências npm
        └── app/
            ├── page.tsx                 # 🏠 Landing page
            ├── auth/
            │   └── page.tsx             # 🔐 Login e cadastro (todos os perfis)
            ├── dashboard/
            │   ├── admin/page.tsx       # 👨‍💼 Dashboard Administrador
            │   ├── professor/page.tsx   # 👨‍🏫 Dashboard Professor
            │   ├── aluno/page.tsx       # 🎓 Dashboard Aluno
            │   └── empresa/page.tsx     # 🏢 Dashboard Empresa Parceira
            └── lib/
                └── api.ts               # 🔌 Helper de chamadas HTTP (fetch + JWT)
```

---

## 🧪 Testes

O sistema inclui dados de teste pré-carregados automaticamente no startup via `DataSeeder`. Não é necessário nenhuma configuração adicional.

**Perfis disponíveis para teste:**

| Perfil             | Quantidade | Detalhes                               |
| :----------------- | :--------: | :------------------------------------- |
| Administrador      |     1      | Acesso total ao sistema                |
| Professores        |     6      | Cada um com cota mensal de 1000 moedas |
| Alunos             |     3      | Saldo inicial de 200 moedas            |
| Empresas Parceiras |     3      | Com vantagens pré-cadastradas          |

> Consulte [`CREDENCIAIS_TESTE.md`](./CREDENCIAIS_TESTE.md) para os e-mails e senhas.

### Fluxo de teste end-to-end sugerido:

```
1. Login como Professor → Enviar moedas para um Aluno
2. Login como Aluno     → Resgatar uma Vantagem → Copiar o cupom
3. Login como Empresa   → Validar o cupom recebido
4. Login como Admin     → Criar nova Instituição
```

---

## 🔗 Documentações Utilizadas

- 📖 [Documentação do **Spring Boot 3.x**](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- 📖 [**Spring Security** — JWT e Stateless Authentication](https://docs.spring.io/spring-security/reference/)
- 📖 [**jjwt** — Java JWT Library](https://github.com/jwtk/jjwt)
- 📖 [**Next.js** — App Router](https://nextjs.org/docs)
- 📖 [**Tailwind CSS v4** — Documentação](https://tailwindcss.com/docs)
- 📖 [**Render** — Deploy com Docker e render.yaml](https://render.com/docs/blueprint-spec)
- 📖 [**Vercel** — Deploy Next.js](https://vercel.com/docs/frameworks/nextjs)
- 📖 [**Flyway** — Database Migrations](https://documentation.red-gate.com/fd)
- 📖 [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto                                                                                                                      | :octocat: GitHub                                                                                                                                                  | 💼 LinkedIn                                                                                                                                                                  | 📤 Gmail                                                                                                                                                       |
| ------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Igor    | <div align="center"><img src="https://github.com/igorfclima.png" width="70px" height="70px" style="border-radius:50%"></div> | <div align="center"><a href="https://github.com/igorfclima"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/igorfclima"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:igorfclima@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona funcionalidade X'`). _(Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))_
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo suporte institucional e formação em boas práticas de desenvolvimento.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos ensinamentos em Arquitetura de Software, Padrões de Projeto e Laboratório de Desenvolvimento de Software.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

**Versão:** 1.0.0 &nbsp;|&nbsp; **Última Atualização:** Maio 2026
