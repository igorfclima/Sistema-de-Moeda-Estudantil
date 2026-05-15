# 🔐 Credenciais de Teste - Sistema de Moeda Estudantil

## 📋 Resumo

Sistema contém dados de teste para todos os tipos de usuário. Todos os usuários de teste usam a senha padrão **`Senha@123`** (exceto Admin que usa **`Admin@123`**).

---

## 👨‍💼 Administrador (Admin)

| Campo         | Valor                     |
| ------------- | ------------------------- |
| **Email**     | `admin@sistemamerito.com` |
| **Senha**     | `Admin@123`               |
| **Role**      | `ROLE_ADMIN`              |
| **Dashboard** | `/dashboard/admin`        |

**Acesso**: Sistema de gerenciamento de instituições, professores e visualização de estatísticas.

---

## 🏫 Instituições

Todas as 4 instituições estão cadastradas e ativas:

| CNPJ                 | Nome da Instituição          |
| -------------------- | ---------------------------- |
| `11.111.111/0001-11` | Instituto Federal do Vale    |
| `22.222.222/0001-22` | Centro Educacional Horizonte |
| `33.333.333/0001-33` | Escola Técnica Aurora        |
| `44.444.444/0001-44` | Faculdade Integra            |

---

## 👨‍🏫 Professores (6 Professores)

Todos os professores usam a senha **`Senha@123`**

| CPF              | Nome            | Email                            | Instituição                  | Departamento  |
| ---------------- | --------------- | -------------------------------- | ---------------------------- | ------------- |
| `111.111.111-11` | Paulo Almeida   | paulo.almeida@ifvale.edu.br      | Instituto Federal do Vale    | Coordenação   |
| `222.222.222-22` | Marina Costa    | marina.costa@horizonte.edu.br    | Centro Educacional Horizonte | Matemática    |
| `333.333.333-33` | Renato Souza    | renato.souza@aurora.edu.br       | Escola Técnica Aurora        | Informática   |
| `444.444.444-44` | Carla Mendes    | carla.mendes@integra.edu.br      | Faculdade Integra            | Administração |
| `555.555.555-55` | Bruno Lima      | bruno.lima@ifvale.edu.br         | Instituto Federal do Vale    | Engenharia    |
| `666.666.666-66` | Aline Fernandes | aline.fernandes@horizonte.edu.br | Centro Educacional Horizonte | Pedagogia     |

**Acesso**: Visualização de extrato, envio de moedas para alunos, gerenciamento de mérito.

---

## 🎓 Alunos (3 Alunos)

Todos os alunos usam a senha **`Senha@123`**

| CPF              | RG              | Nome           | Email                           | Curso                  | Instituição                  | Saldo Inicial |
| ---------------- | --------------- | -------------- | ------------------------------- | ---------------------- | ---------------------------- | ------------- |
| `777.777.777-77` | `12.345.678-90` | João Silva     | `77777777777@sistemamerito.com` | Engenharia de Software | Instituto Federal do Vale    | 50 moedas     |
| `888.888.888-88` | `98.765.432-10` | Maria Santos   | `88888888888@sistemamerito.com` | Administração          | Centro Educacional Horizonte | 50 moedas     |
| `999.999.999-99` | `55.555.555-55` | Pedro Oliveira | `99999999999@sistemamerito.com` | Informática            | Escola Técnica Aurora        | 50 moedas     |

**Acesso**: Visualização de saldo, visualização de extrato, resgate de vantagens.

---

## 🏢 Empresas Parceiras (3 Empresas)

Todas as empresas usam a senha **`Senha@123`**

| CNPJ                 | Nome da Empresa             | Email                                |
| -------------------- | --------------------------- | ------------------------------------ |
| `12.345.678/0001-00` | Tech Solutions Brasil       | `contato@techsolutions.com.br`       |
| `98.765.432/0001-11` | Consultoria e Negócios Ltda | `contato@consultorianegocios.com.br` |
| `55.555.555/0001-22` | Inovação Digital S/A        | `contato@inovacaodigital.com.br`     |

**Descrições**:

- Tech Solutions Brasil: Empresa de tecnologia e soluções em software
- Consultoria e Negócios Ltda: Consultoria empresarial e gestão estratégica
- Inovação Digital S/A: Desenvolvimento de sistemas e aplicações

**Acesso**: Cadastro de vantagens/benefícios, visualização de resgates realizados.

---

## 🔐 Senha Padrão de Teste

- **Para todos os usuários** (exceto Admin): `Senha@123`
- **Para o Admin**: `Admin@123`

---

## ✅ Recursos de Teste Disponíveis

### 1️⃣ Admin Dashboard

- Gerenciar instituições (listar, criar, editar, deletar)
- Carregar PDFs para importação em massa de professores
- Visualizar estatísticas de instituições e usuários

### 2️⃣ Professor

- Consultar saldo de moedas
- Visualizar extrato de transações
- Enviar moedas para alunos

### 3️⃣ Aluno

- Consultar saldo de moedas disponíveis (começa com 50)
- Visualizar extrato de movimentações
- Resgatar vantagens de empresas parceiras

### 4️⃣ Empresa Parceira

- Cadastrar benefícios/vantagens
- Visualizar resgates realizados por alunos
- Gerenciar catálogo de vantagens

---

## 🚀 Como Testar

### Teste de Login Administrador

```
Email: admin@sistemamerito.com
Senha: Admin@123
URL: http://localhost:3000
Redirecionamento esperado: /dashboard/admin
```

### Teste de Login Professor

```
Email: paulo.almeida@ifvale.edu.br
Senha: Senha@123
URL: http://localhost:3000
Redirecionamento esperado: /dashboard/professor
```

### Teste de Login Aluno

```
Email: 77777777777@sistemamerito.com (João Silva)
Senha: Senha@123
URL: http://localhost:3000
Redirecionamento esperado: /dashboard/aluno
```

### Teste de Login Empresa

```
Email: contato@techsolutions.com.br
Senha: Senha@123
URL: http://localhost:3000
Redirecionamento esperado: /dashboard/empresa
```

---

## 📝 Notas Importantes

1. **Email dos Alunos**: Gerado automaticamente a partir do CPF (sem pontos/hífen) + @sistemamerito.com
    - João Silva (777.777.777-77) → `77777777777@sistemamerito.com`
    - Maria Santos (888.888.888-88) → `88888888888@sistemamerito.com`
    - Pedro Oliveira (999.999.999-99) → `99999999999@sistemamerito.com`

2. **Saldo Inicial**:
    - Alunos começam com 50 moedas
    - Professores começam com 0 moedas (podem ser creditados pelo admin)

3. **Auto-detecção de Role**:
    - O sistema detecta automaticamente o tipo de usuário após login
    - Não é necessário seleção manual de perfil

4. **Redirecionamento Automático**:
    - Admin → `/dashboard/admin`
    - Professor → `/dashboard/professor`
    - Aluno → `/dashboard/aluno`
    - Empresa → `/dashboard/empresa`

---

## 🔄 Ciclo de Transação Completo (Recomendado para Testes)

1. **Admin**:
    - Login com credenciais de admin
    - Verificar instituições cadastradas
    - Criar nova instituição (opcional)

2. **Professor**:
    - Login com credenciais de professor
    - Visualizar saldo (começa em 0)
    - Enviar moedas para aluno

3. **Aluno**:
    - Login com credenciais de aluno
    - Visualizar saldo aumentado (recebimento de moedas do professor)
    - Visualizar extrato

4. **Empresa Parceira**:
    - Login com credenciais de empresa
    - Criar vantagem/benefício
    - Disponibilizar para resgate

5. **Aluno** (novamente):
    - Resgatar vantagem da empresa
    - Visualizar saldo diminuído

---

## 🆘 Troubleshooting

### Login retorna erro "Usuário não encontrado"

- Verifique se o servidor backend está rodando na porta 8080
- Confirme que a senha está correta (`Senha@123` ou `Admin@123`)

### Dashboard em branco ou erro 404

- Limpe cache do navegador
- Verifique se o JWT token está sendo armazenado em localStorage
- Verifique se a porta 3000 (frontend) está acessível

### Dados de teste não aparecem

- Reinicie o backend para que DataSeeder execute
- Verifique logs do Spring Boot para erros de inicialização
- Confirme conexão com banco de dados PostgreSQL

---

**Última Atualização**: 15 de maio de 2026
**Versão do Sistema**: 1.0.0
