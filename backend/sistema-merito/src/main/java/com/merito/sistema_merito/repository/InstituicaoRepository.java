package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Instituicao;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstituicaoRepository extends JpaRepository<Instituicao, UUID> {

    Optional<Instituicao> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);
}
