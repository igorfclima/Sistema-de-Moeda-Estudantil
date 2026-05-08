INSERT INTO instituicoes (id, nome, cnpj, ativa) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Instituto Federal do Vale', '11.111.111/0001-11', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Centro Educacional Horizonte', '22.222.222/0001-22', TRUE),
    ('33333333-3333-3333-3333-333333333333', 'Escola Técnica Aurora', '33.333.333/0001-33', TRUE),
    ('44444444-4444-4444-4444-444444444444', 'Faculdade Integra', '44.444.444/0001-44', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO usuarios (id, tipo_usuario, email, senha_hash) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Professor', 'paulo.almeida@ifvale.edu.br', '$2a$10$I9Cx/147oos4UsMGzYqeZ.DNFZ91W9APPawB2MNO3tr4XmZAEFgaa'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Professor', 'marina.costa@chorizonte.edu.br', '$2a$10$I9Cx/147oos4UsMGzYqeZ.DNFZ91W9APPawB2MNO3tr4XmZAEFgaa'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Professor', 'renato.souza@aurora.edu.br', '$2a$10$I9Cx/147oos4UsMGzYqeZ.DNFZ91W9APPawB2MNO3tr4XmZAEFgaa'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Professor', 'carla.mendes@integra.edu.br', '$2a$10$I9Cx/147oos4UsMGzYqeZ.DNFZ91W9APPawB2MNO3tr4XmZAEFgaa'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Professor', 'bruno.lima@ifvale.edu.br', '$2a$10$I9Cx/147oos4UsMGzYqeZ.DNFZ91W9APPawB2MNO3tr4XmZAEFgaa'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Professor', 'aline.fernandes@chorizonte.edu.br', '$2a$10$I9Cx/147oos4UsMGzYqeZ.DNFZ91W9APPawB2MNO3tr4XmZAEFgaa')
ON CONFLICT DO NOTHING;

INSERT INTO professores (id, nome, cpf, departamento, saldo_moedas, instituicao_id) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Paulo Almeida', '111.111.111-11', 'Coordenação', 0, '11111111-1111-1111-1111-111111111111'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Marina Costa', '222.222.222-22', 'Matemática', 0, '22222222-2222-2222-2222-222222222222'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Renato Souza', '333.333.333-33', 'Informática', 0, '33333333-3333-3333-3333-333333333333'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Carla Mendes', '444.444.444-44', 'Administração', 0, '44444444-4444-4444-4444-444444444444'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Bruno Lima', '555.555.555-55', 'Engenharia', 0, '11111111-1111-1111-1111-111111111111'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Aline Fernandes', '666.666.666-66', 'Pedagogia', 0, '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;