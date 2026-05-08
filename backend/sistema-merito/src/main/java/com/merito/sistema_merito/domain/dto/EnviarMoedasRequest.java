package com.merito.sistema_merito.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EnviarMoedasRequest(
        @NotNull UUID alunoId,
        @Min(1) int quantidade,
        @NotBlank String motivo
) {
}
