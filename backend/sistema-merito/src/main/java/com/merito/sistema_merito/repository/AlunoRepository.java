package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Aluno;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, UUID> {

    Optional<Aluno> findByCpf(String cpf);

    Optional<Aluno> findByRg(String rg);

    boolean existsByCpf(String cpf);
}
