package com.merito.sistema_merito.repository;

import com.merito.sistema_merito.domain.entity.Notificacao;
import com.merito.sistema_merito.domain.enums.TipoNotificacao;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacaoRepository extends JpaRepository<Notificacao, UUID> {

    List<Notificacao> findByAlunoIdOrderByEnviadaEmDesc(UUID alunoId);

    List<Notificacao> findByEmpresaParceiraIdOrderByEnviadaEmDesc(UUID empresaParceiraId);

    List<Notificacao> findByTipoOrderByEnviadaEmDesc(TipoNotificacao tipo);
}
