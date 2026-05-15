package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.Cupom;
import com.merito.sistema_merito.domain.entity.TransacaoResgate;
import com.merito.sistema_merito.domain.entity.Vantagem;
import com.merito.sistema_merito.domain.enums.StatusVantagem;
import com.merito.sistema_merito.exception.RecursoNaoEncontradoException;
import com.merito.sistema_merito.exception.SaldoInsuficienteException;
import com.merito.sistema_merito.exception.VantagemIndisponivelException;
import com.merito.sistema_merito.repository.AlunoRepository;
import com.merito.sistema_merito.repository.CupomRepository;
import com.merito.sistema_merito.repository.TransacaoResgateRepository;
import com.merito.sistema_merito.repository.VantagemRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicoResgate {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoResgateRepository transacaoResgateRepository;
    private final CupomRepository cupomRepository;
    private final ServicoEmail servicoEmail;

    public ServicoResgate(AlunoRepository alunoRepository, VantagemRepository vantagemRepository, TransacaoResgateRepository transacaoResgateRepository, CupomRepository cupomRepository, ServicoEmail servicoEmail) {
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.transacaoResgateRepository = transacaoResgateRepository;
        this.cupomRepository = cupomRepository;
        this.servicoEmail = servicoEmail;
    }

    /**
     * Realiza o resgate de uma vantagem por um aluno.
     * Operação é atômica: valida saldo e disponibilidade, debita aluno, cria transação e cupom.
     *
     * @param alunoId     ID do aluno que está resgatando
     * @param vantagemId  ID da vantagem a ser resgatada
     * @return TransacaoResgate com Cupom gerado
     * @throws RecursoNaoEncontradoException se aluno ou vantagem não existirem
     * @throws SaldoInsuficienteException    se aluno não tiver saldo suficiente
     * @throws VantagemIndisponivelException se vantagem não estiver ativa
     */
    @Transactional
    public TransacaoResgate resgatar(UUID alunoId, UUID vantagemId) {
        // Busca aluno
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com ID " + alunoId + " não encontrado"));

        // Busca vantagem
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Vantagem com ID " + vantagemId + " não encontrada"));

        // Valida se vantagem está ativa
        if (!vantagem.getStatus().equals(StatusVantagem.ATIVA)) {
            throw new VantagemIndisponivelException(
                    "Vantagem " + vantagem.getNome() + " não está disponível");
        }

        // Valida saldo do aluno
        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new SaldoInsuficienteException(
                    String.format("Aluno possui saldo insuficiente. Saldo: %d, Custo: %d",
                            aluno.getSaldoMoedas(), vantagem.getCustoMoedas()));
        }

        // Debita aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        // Cria transação de resgate
        TransacaoResgate transacao = new TransacaoResgate(null, OffsetDateTime.now(), vantagem.getCustoMoedas(), aluno, vantagem, null);

        transacao = transacaoResgateRepository.save(transacao);

        // Gera cupom com código único
        String codigoUnico = gerarCodigoUniquo();
        Cupom cupom = new Cupom(null, codigoUnico, OffsetDateTime.now(), false, transacao);

        cupom = cupomRepository.save(cupom);

        // Atualiza transação com cupom
        transacao.setCupom(cupom);
        transacao = transacaoResgateRepository.save(transacao);

        // Dispara notificações por email
        servicoEmail.enviarCupomAluno(aluno, cupom);
        servicoEmail.enviarNotificacaoEmpresa(vantagem.getEmpresaParceira(), cupom);

        return transacao;
    }

    /**
     * Retorna o histórico de resgates de um aluno.
     *
     * @param alunoId ID do aluno
     * @return Lista de transações de resgate ordenadas por data (mais recente primeiro)
     */
    public List<TransacaoResgate> consultarResgatesAluno(UUID alunoId) {
        // Valida que aluno existe
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com ID " + alunoId + " não encontrado"));

        return transacaoResgateRepository.findByAlunoIdOrderByDataHoraDesc(alunoId);
    }

    /**
     * Retorna o histórico de resgates de uma empresa parceira.
     *
     * @param empresaParceiraId ID da empresa parceira
     * @return Lista de transações de resgate ordenadas por data (mais recente primeiro)
     */
    public List<TransacaoResgate> consultarResgatesEmpresa(UUID empresaParceiraId) {
        return transacaoResgateRepository.findByVantagemEmpresaParceiraIdOrderByDataHoraDesc(empresaParceiraId);
    }

    /**
     * Valida e marca um cupom como utilizado.
     *
     * @param codigoUnico Código único do cupom
     * @return Cupom validado e marcado como utilizado
     * @throws RecursoNaoEncontradoException se cupom não existir
     */
    @Transactional
    public Cupom validarCupom(String codigoUnico) {
        Cupom cupom = cupomRepository.findByCodigoUnico(codigoUnico)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Cupom com código " + codigoUnico + " não encontrado"));

        if (cupom.getUtilizado()) {
            throw new IllegalStateException("Cupom já foi utilizado");
        }

        cupom.setUtilizado(true);
        cupom = cupomRepository.save(cupom);

        return cupom;
    }

    /**
     * Gera um código único para o cupom.
     * Formato: UUID truncado + timestamp (16 caracteres)
     *
     * @return Código único em formato alpanumérico
     */
    private String gerarCodigoUniquo() {
        String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        long timestamp = System.currentTimeMillis();
        return (uuid + Long.toHexString(timestamp)).toUpperCase();
    }
}
