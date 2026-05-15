package com.merito.sistema_merito.domain.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EmpresaResgateDto(
        UUID id,
        OffsetDateTime data,
        String cupom,
        String nomeAluno,
        String nomeVantagem,
        Integer custoMoedas
) {
}
