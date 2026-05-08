package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, UUID> {

    Optional<EmpresaParceira> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);
}
