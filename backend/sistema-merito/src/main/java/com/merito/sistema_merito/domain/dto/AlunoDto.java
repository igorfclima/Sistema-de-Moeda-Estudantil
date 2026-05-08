package com.merito.sistema_merito.domain.dto;

import java.util.UUID;

public record AlunoDto(
        UUID id,
        String nome,
        String email,
        String cpf,
        String curso,
        Integer saldoMoedas,
        UUID instituicaoId
) {
}
