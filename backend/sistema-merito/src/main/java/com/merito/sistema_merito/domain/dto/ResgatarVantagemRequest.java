package com.merito.sistema_merito.domain.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ResgatarVantagemRequest(
        @NotNull UUID vantagemId
) {
}
