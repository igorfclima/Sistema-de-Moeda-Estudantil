# 📚 Sistema de Moeda Estudantil (SME)

Sistema completo de gerenciamento de moeda estudantil com suporte a múltiplos papéis de usuário (Administrador, Professor, Aluno e Empresa Parceira).

## 🎯 Objetivo

Criar um ecossistema educacional onde:

- 👨‍🏫 **Professores** concedem moedas aos alunos por mérito e desempenho
- 🎓 **Alunos** ganham, acumulam e resgatam moedas em benefícios de empresas parceiras
- 🏢 **Empresas Parceiras** oferecem vantagens e benefícios aos alunos
- 👨‍💼 **Administrador** gerencia o sistema e instituições

## 🏗️ Arquitetura

### Backend

- **Framework**: Spring Boot 4.0.6
- **Linguagem**: Java 16
- **Banco de Dados**: PostgreSQL 18.3
- **Autenticação**: JWT (jjwt 0.12.6)
- **ORM**: Hibernate 7.x
- **Build**: Maven

### Frontend

- **Framework**: Next.js 16.2.6
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS
- **UI Components**: React Icons
- **Router**: App Router (Next.js)

## 🚀 Quick Start

### Pré-requisitos

- Java 16+
- Node.js 18+
- PostgreSQL 18+

### 1. Backend (Spring Boot)

```bash
cd backend/sistema-merito
.\mvnw.cmd spring-boot:run
```

Servidor rodará em: `http://localhost:8080`

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Aplicação estará disponível em: `http://localhost:3000`

## 🔐 Credenciais de Teste

O sistema inclui dados de teste pre-carregados no startup. Veja [CREDENCIAIS_TESTE.md](./CREDENCIAIS_TESTE.md) para:

- ✅ Login do Administrador
- ✅ Logins de Professores (6 disponíveis)
- ✅ Logins de Alunos (3 disponíveis)
- ✅ Logins de Empresas Parceiras (3 disponíveis)
- ✅ Instruções de teste end-to-end

## 📋 Funcionalidades Principais

### 👨‍💼 Administrador

- [x] Dashboard com estatísticas gerais
- [x] Gerenciar instituições (CRUD)
- [x] Importar professores via PDF
- [x] Gerar PDFs de confirmação com credenciais

### 👨‍🏫 Professor

- [x] Visualizar saldo de moedas
- [x] Consultar extrato de movimentações
- [x] Enviar moedas aos alunos
- [ ] Relatórios de alunos por turma

### 🎓 Aluno

- [x] Visualizar saldo de moedas
- [x] Consultar extrato de transações
- [x] Resgatar vantagens de empresas
- [ ] Histórico de resgates
- [ ] Notificações de transferências

### 🏢 Empresa Parceira

- [x] Cadastrar benefícios/vantagens
- [x] Visualizar resgates realizados
- [ ] Relatórios de utilização
- [ ] Dashboard de vendas

## 🗂️ Estrutura do Projeto

```
Sistema-de-Moeda-Estudantil/
├── backend/
│   └── sistema-merito/          # Spring Boot Application
│       ├── src/main/java/       # Código-fonte Java
│       ├── pom.xml             # Dependências Maven
│       └── ...
├── frontend/                     # Next.js Application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── public/                  # Assets estáticos
│   └── package.json             # Dependências npm
├── docs/                         # Documentação
├── CREDENCIAIS_TESTE.md         # 📌 LEIA ISTO PRIMEIRO
└── README.md                     # Este arquivo
```

## 🔄 Fluxo de Transação Típico

```
Professor → Envia Moedas → Aluno → Resga Vantagem → Empresa Parceira
```

## 🛠️ Stack Tecnológico Detalhado

### Backend

- Spring Boot Web
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL Driver
- PDFBox (para processamento de PDFs)
- JavaMailSender
- Flyway (migrations)

### Frontend

- React 19 com TypeScript
- Next.js 16.2.6 (App Router)
- Tailwind CSS
- React Icons
- localStorage para JWT

## 📚 Documentação

- [Credenciais de Teste](./CREDENCIAIS_TESTE.md) - **👈 COMECE AQUI**
- [Documentação da API](/docs/API.md) - _(Em preparação)_
- [Guia de Instalação](/docs/SETUP.md) - _(Em preparação)_

## 🐛 Troubleshooting

### Porta 8080 já em uso

```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Frontend não conecta ao backend

- Verifique se backend está rodando em `http://localhost:8080`
- Verifique CORS em `application.properties`
- Limpe cache do navegador

### Dados de teste não carregam

- Verifique conexão com PostgreSQL
- Verifique logs do Spring Boot
- Reinicie o backend para executar DataSeeder

## 📦 Dependências Principais

### Backend

- `spring-boot-starter-web`: 4.0.6
- `spring-boot-starter-security`: 4.0.6
- `spring-boot-starter-data-jpa`: 4.0.6
- `spring-boot-starter-mail`: 4.0.6
- `jjwt`: 0.12.6
- `hibernate-core`: 7.x
- `pdfbox`: 2.0.29
- `postgresql`: 18.3

### Frontend

- `next`: 16.2.6
- `react`: 19.x
- `typescript`: 5.x
- `tailwindcss`: 3.x
- `react-icons`: latest

## 👥 Contribuidores

- Sistema desenvolvido para ambiente educacional

## 📝 Licença

Projeto educacional de código aberto

## ✅ Checklist para Primeiro Uso

- [ ] Ler [CREDENCIAIS_TESTE.md](./CREDENCIAIS_TESTE.md)
- [ ] Iniciar backend (`mvnw spring-boot:run`)
- [ ] Iniciar frontend (`npm run dev`)
- [ ] Acessar http://localhost:3000
- [ ] Testar login com admin
- [ ] Testar login com professor
- [ ] Testar login com aluno
- [ ] Testar login com empresa

---

**Versão**: 1.0.0
**Última Atualização**: Maio 2026
