package com.merito.sistema_merito.domain.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CupomDto(
        UUID id,
        String codigoUnico,
        OffsetDateTime dataGeracao,
        Boolean utilizado
) {
}
