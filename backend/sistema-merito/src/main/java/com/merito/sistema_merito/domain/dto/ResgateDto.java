package com.merito.sistema_merito.domain.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ResgateDto(
        UUID id,
        UUID vantagemId,
        OffsetDateTime data,
        String cupom,
        String nomeVantagem,
        Integer custoMoedas
) {
}
