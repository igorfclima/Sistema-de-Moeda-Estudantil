package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Vantagem;
import com.merito.sistema_merito.domain.enums.StatusVantagem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VantagemRepository extends JpaRepository<Vantagem, UUID> {

    List<Vantagem> findByStatus(StatusVantagem status);

    List<Vantagem> findByEmpresaParceiraId(UUID empresaParceiraId);
}
