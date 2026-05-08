package com.merito.sistema_merito.domain.dto;

import java.util.UUID;

public record EmpresaParceiraDto(
        UUID id,
        String nomeEmpresa,
        String email,
        String cnpj,
        String descricao
) {
}
