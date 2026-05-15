package com.merito.sistema_merito.domain.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TransacaoEnvioDto(
        UUID id,
        String tipo,
        Integer moedas,
        OffsetDateTime data,
        String descricao,
        String nomeProfessor,
        String nomeAluno
) {
}
