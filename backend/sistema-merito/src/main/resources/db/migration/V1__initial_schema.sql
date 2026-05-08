CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE instituicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    ativa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_usuario VARCHAR(31) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL
);

CREATE TABLE alunos (
    id UUID PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    rg VARCHAR(20) NOT NULL UNIQUE,
    endereco VARCHAR(255),
    curso VARCHAR(120) NOT NULL,
    saldo_moedas INTEGER NOT NULL DEFAULT 0,
    instituicao_id UUID NOT NULL,
    CONSTRAINT fk_alunos_usuario FOREIGN KEY (id) REFERENCES usuarios (id),
    CONSTRAINT fk_alunos_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes (id)
);

CREATE TABLE professores (
    id UUID PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    departamento VARCHAR(120) NOT NULL,
    saldo_moedas INTEGER NOT NULL DEFAULT 0,
    instituicao_id UUID NOT NULL,
    CONSTRAINT fk_professores_usuario FOREIGN KEY (id) REFERENCES usuarios (id),
    CONSTRAINT fk_professores_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes (id)
);

CREATE TABLE empresas_parceiras (
    id UUID PRIMARY KEY,
    nome_empresa VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    CONSTRAINT fk_empresas_usuario FOREIGN KEY (id) REFERENCES usuarios (id)
);

CREATE TABLE administradores (
    id UUID PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    CONSTRAINT fk_administradores_usuario FOREIGN KEY (id) REFERENCES usuarios (id)
);

CREATE TABLE vantagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    foto_url VARCHAR(500),
    custo_moedas INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    empresa_parceira_id UUID NOT NULL,
    CONSTRAINT fk_vantagens_empresa FOREIGN KEY (empresa_parceira_id) REFERENCES empresas_parceiras (id)
);

CREATE TABLE transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_transacao VARCHAR(31) NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    quantidade INTEGER NOT NULL
);

CREATE TABLE transacoes_envio (
    id UUID PRIMARY KEY,
    motivo VARCHAR(300) NOT NULL,
    professor_id UUID NOT NULL,
    aluno_id UUID NOT NULL,
    CONSTRAINT fk_trans_envio_transacao FOREIGN KEY (id) REFERENCES transacoes (id),
    CONSTRAINT fk_trans_envio_professor FOREIGN KEY (professor_id) REFERENCES professores (id),
    CONSTRAINT fk_trans_envio_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id)
);

CREATE TABLE transacoes_resgate (
    id UUID PRIMARY KEY,
    aluno_id UUID NOT NULL,
    vantagem_id UUID NOT NULL,
    CONSTRAINT fk_trans_resgate_transacao FOREIGN KEY (id) REFERENCES transacoes (id),
    CONSTRAINT fk_trans_resgate_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id),
    CONSTRAINT fk_trans_resgate_vantagem FOREIGN KEY (vantagem_id) REFERENCES vantagens (id)
);

CREATE TABLE cupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_unico VARCHAR(80) NOT NULL UNIQUE,
    data_geracao TIMESTAMP WITH TIME ZONE NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT FALSE,
    transacao_resgate_id UUID NOT NULL UNIQUE,
    CONSTRAINT fk_cupom_transacao_resgate FOREIGN KEY (transacao_resgate_id) REFERENCES transacoes_resgate (id)
);

CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_destino VARCHAR(150) NOT NULL,
    assunto VARCHAR(180) NOT NULL,
    mensagem VARCHAR(1000) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    enviada_em TIMESTAMP WITH TIME ZONE NOT NULL,
    aluno_id UUID,
    empresa_parceira_id UUID,
    CONSTRAINT fk_notificacao_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id),
    CONSTRAINT fk_notificacao_empresa FOREIGN KEY (empresa_parceira_id) REFERENCES empresas_parceiras (id)
);

CREATE INDEX idx_alunos_instituicao ON alunos (instituicao_id);
CREATE INDEX idx_professores_instituicao ON professores (instituicao_id);
CREATE INDEX idx_vantagens_empresa_status ON vantagens (empresa_parceira_id, status);
CREATE INDEX idx_transacoes_data_hora ON transacoes (data_hora DESC);
CREATE INDEX idx_transacoes_envio_aluno ON transacoes_envio (aluno_id);
CREATE INDEX idx_transacoes_envio_professor ON transacoes_envio (professor_id);
CREATE INDEX idx_transacoes_resgate_aluno ON transacoes_resgate (aluno_id);
CREATE INDEX idx_transacoes_resgate_vantagem ON transacoes_resgate (vantagem_id);
CREATE INDEX idx_notificacoes_aluno_enviada ON notificacoes (aluno_id, enviada_em DESC);
CREATE INDEX idx_notificacoes_empresa_enviada ON notificacoes (empresa_parceira_id, enviada_em DESC);
