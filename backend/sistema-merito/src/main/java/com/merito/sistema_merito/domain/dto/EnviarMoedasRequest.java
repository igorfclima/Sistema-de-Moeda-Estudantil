package com.merito.sistema_merito.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record EnviarMoedasRequest(
        
        @NotNull(message = "O ID do aluno é obrigatório.") 
        UUID alunoId,
        
        @Min(value = 1, message = "A quantidade mínima para envio é de 1 moeda.") 
        int quantidade,
        
        @NotBlank(message = "O motivo do envio não pode ser vazio.") 
        @Size(max = 255, message = "O motivo deve conter no máximo 255 caracteres.") 
        String motivo

) {
}