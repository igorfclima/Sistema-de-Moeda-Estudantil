package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Professor;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    Optional<Professor> findByCpf(String cpf);

    boolean existsByCpf(String cpf);
}
