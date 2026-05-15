package com.merito.sistema_merito.domain.dto;

import com.merito.sistema_merito.domain.enums.StatusVantagem;
import java.util.UUID;

public record VantagemRequest(
        String nome,
        String descricao,
        String fotoUrl,
        Integer custoMoedas,
        UUID empresaParceiraId,
        StatusVantagem status
) {
}
