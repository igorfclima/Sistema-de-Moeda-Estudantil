package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Cupom;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CupomRepository extends JpaRepository<Cupom, UUID> {

    Optional<Cupom> findByCodigoUnico(String codigoUnico);

    boolean existsByCodigoUnico(String codigoUnico);
}
