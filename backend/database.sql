CREATE TABLE IF NOT EXISTS usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL DEFAULT '1',
    foto TEXT
);

CREATE TABLE IF NOT EXISTS agendamento (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    data_ida DATE NOT NULL,
    data_volta DATE,
    passageiros INT NOT NULL DEFAULT 1,
    aeroporto VARCHAR(100),
    empresa_voo VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pendente'
);

CREATE TABLE IF NOT EXISTS notificacao (
    id BIGSERIAL PRIMARY KEY,
    agendamento_id BIGINT NOT NULL REFERENCES agendamento(id) ON DELETE CASCADE,
    data_notificacao DATE NOT NULL DEFAULT CURRENT_DATE,
    horario TIME NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);