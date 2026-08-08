package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.dto.TransacaoEnvioDto;
import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.domain.entity.TransacaoEnvio;
import com.merito.sistema_merito.exception.RecursoNaoEncontradoException;
import com.merito.sistema_merito.exception.SaldoInsuficienteException;
import com.merito.sistema_merito.repository.AlunoRepository;
import com.merito.sistema_merito.repository.ProfessorRepository;
import com.merito.sistema_merito.repository.TransacaoEnvioRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicoMoeda {

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoEnvioRepository transacaoEnvioRepository;
    private final ServicoEmail servicoEmail;

    // MOEDAS_SEMESTRAL hardcoded. Deveria ser lido de
    // application.properties usando @Value para permitir configuração por ambiente.
    private static final int MOEDAS_SEMESTRAL = 1000;

    public ServicoMoeda(ProfessorRepository professorRepository, AlunoRepository alunoRepository, TransacaoEnvioRepository transacaoEnvioRepository, ServicoEmail servicoEmail) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoEnvioRepository = transacaoEnvioRepository;
        this.servicoEmail = servicoEmail;
    }

    /**
     * Envia moedas de um professor para um aluno.
     * Operação é atômica: valida saldo, debita professor e credita aluno.
     *
     * @param professorId ID do professor remetente
     * @param alunoId     ID do aluno destinatário
     * @param quantidade  Quantidade de moedas a enviar
     * @param motivo      Motivo do envio (obrigatório)
     * @return TransacaoEnvio registrada
     * @throws RecursoNaoEncontradoException se professor ou aluno não existirem
     * @throws SaldoInsuficienteException    se professor não tiver saldo suficiente
     */
    @Transactional
    public TransacaoEnvio enviarMoedas(UUID professorId, UUID alunoId, int quantidade, String motivo) {
        // Falta log estruturado aqui. Operações críticas como débito/crédito deveriam
        // ser registradas com @Slf4j para auditoria e debug.
        
        // Valida quantidade
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade de moedas deve ser maior que zero");
        }

        // Busca professor
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor com ID " + professorId + " não encontrado"));

        // Busca aluno
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com ID " + alunoId + " não encontrado"));

        // Valida saldo do professor
        if (professor.getSaldoMoedas() < quantidade) {
            throw new SaldoInsuficienteException(
                    String.format("Professor possui saldo insuficiente. Saldo: %d, Solicitado: %d",
                            professor.getSaldoMoedas(), quantidade));
        }

        // Debita do professor
        professor.setSaldoMoedas(professor.getSaldoMoedas() - quantidade);
        professorRepository.save(professor);

        // Credita ao aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + quantidade);
        alunoRepository.save(aluno);

        // Registra transação
        TransacaoEnvio transacao = new TransacaoEnvio(null, OffsetDateTime.now(), quantidade, motivo, professor, aluno);

        transacao = transacaoEnvioRepository.save(transacao);

        // Dispara notificações: confirmação ao professor e recebimento ao aluno
        servicoEmail.enviarConfirmacaoProfessor(professor, transacao);
        servicoEmail.enviarNotificacaoRecebimento(aluno, transacao);

        return transacao;
    }

    /**
     * Credita as moedas semestrais (1.000 moedas) a todos os professores.
     * As moedas são acumuláveis.
     */
    @Transactional
    public void creditarSemestralTodos() {
        List<Professor> professores = professorRepository.findAll();

        for (Professor professor : professores) {
            professor.setSaldoMoedas(professor.getSaldoMoedas() + MOEDAS_SEMESTRAL);
            professorRepository.save(professor);
        }
    }

    /**
     * Consulta o saldo de moedas de um professor.
     *
     * @param professorId ID do professor
     * @return Saldo em moedas
     * @throws RecursoNaoEncontradoException se professor não existir
     */
    public int consultarSaldoProfessor(UUID professorId) {
        return professorRepository.findById(professorId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor com ID " + professorId + " não encontrado"))
                .getSaldoMoedas();
    }

    /**
     * Consulta o saldo de moedas de um aluno.
     *
     * @param alunoId ID do aluno
     * @return Saldo em moedas
     * @throws RecursoNaoEncontradoException se aluno não existir
     */
    public int consultarSaldoAluno(UUID alunoId) {
        return alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com ID " + alunoId + " não encontrado"))
                .getSaldoMoedas();
    }

    @Transactional(readOnly = true)
    public List<TransacaoEnvioDto> consultarExtratoAluno(UUID alunoId) {
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com ID " + alunoId + " não encontrado"));

        return transacaoEnvioRepository.findByAlunoIdOrderByDataHoraDesc(alunoId)
                .stream()
                .map(t -> new TransacaoEnvioDto(
                        t.getId(),
                        "RECEBIMENTO",
                        t.getQuantidade(),
                        t.getDataHora(),
                        t.getMotivo(),
                        t.getProfessor().getNome(),
                        t.getAluno().getNome()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TransacaoEnvioDto> consultarExtratoProfessor(UUID professorId) {
        professorRepository.findById(professorId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor com ID " + professorId + " não encontrado"));

        return transacaoEnvioRepository.findByProfessorIdOrderByDataHoraDesc(professorId)
                .stream()
                .map(t -> new TransacaoEnvioDto(
                        t.getId(),
                        "ENVIO",
                        t.getQuantidade(),
                        t.getDataHora(),
                        t.getMotivo(),
                        t.getProfessor().getNome(),
                        t.getAluno().getNome()
                ))
                .toList();
    }
}
