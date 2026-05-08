package com.merito.sistema_merito.domain.dto;

import java.util.UUID;

public record ProfessorDto(
        UUID id,
        String nome,
        String email,
        String cpf,
        String departamento,
        Integer saldoMoedas,
        UUID instituicaoId
) {
}
