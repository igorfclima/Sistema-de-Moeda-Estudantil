package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Administrador;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministradorRepository extends JpaRepository<Administrador, UUID> {
}
