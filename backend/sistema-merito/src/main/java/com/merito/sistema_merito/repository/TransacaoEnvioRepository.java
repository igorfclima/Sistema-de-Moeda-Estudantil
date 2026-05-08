package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.TransacaoEnvio;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransacaoEnvioRepository extends JpaRepository<TransacaoEnvio, UUID> {

    List<TransacaoEnvio> findByAlunoIdOrderByDataHoraDesc(UUID alunoId);

    List<TransacaoEnvio> findByProfessorIdOrderByDataHoraDesc(UUID professorId);
}
