package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.TransacaoResgate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransacaoResgateRepository extends JpaRepository<TransacaoResgate, UUID> {

    List<TransacaoResgate> findByAlunoIdOrderByDataHoraDesc(UUID alunoId);

    List<TransacaoResgate> findByVantagemEmpresaParceiraIdOrderByDataHoraDesc(UUID empresaParceiraId);
}
