package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Transacao;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransacaoRepository extends JpaRepository<Transacao, UUID> {
}
