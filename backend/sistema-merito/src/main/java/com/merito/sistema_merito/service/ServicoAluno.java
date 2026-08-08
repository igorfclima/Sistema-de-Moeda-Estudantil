package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.dto.AlunoRequest;
import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.exception.RecursoNaoEncontradoException;
import com.merito.sistema_merito.repository.AlunoRepository;
import com.merito.sistema_merito.repository.InstituicaoRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ServicoAluno {

    private final AlunoRepository alunoRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.merito.sistema_merito.service.ServicoMoeda servicoMoeda;
    private final com.merito.sistema_merito.service.ServicoResgate servicoResgate;

    public ServicoAluno(AlunoRepository alunoRepository, InstituicaoRepository instituicaoRepository, PasswordEncoder passwordEncoder, com.merito.sistema_merito.service.ServicoMoeda servicoMoeda, com.merito.sistema_merito.service.ServicoResgate servicoResgate) {
        this.alunoRepository = alunoRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.servicoMoeda = servicoMoeda;
        this.servicoResgate = servicoResgate;
    }

    @Transactional
    public Aluno criar(AlunoRequest request) {
        // Sem validação de força de senha. Deveria usar um validador
        // customizado @StrongPassword para garantir senhas seguras.
        
        Optional<Instituicao> instOpt = instituicaoRepository.findById(request.getInstituicaoId());
        if (instOpt.isEmpty()) {
            throw new RecursoNaoEncontradoException("Instituição não encontrada: " + request.getInstituicaoId());
        }
        Instituicao instituicao = instOpt.get();
        Aluno aluno = new Aluno();
        aluno.setEmail(request.getEmail());
        aluno.setSenhaHash(passwordEncoder.encode(request.getSenhaHash()));
        aluno.setNome(request.getNome());
        aluno.setCpf(request.getCpf());
        aluno.setRg(request.getRg());
        aluno.setEndereco(request.getEndereco());
        aluno.setCurso(request.getCurso());
        aluno.setSaldoMoedas(0);
        aluno.setInstituicao(instituicao);
        return alunoRepository.save(aluno);
    }

    public Aluno buscarPorId(UUID id) {
        return alunoRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado: " + id));
    }

    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    @Transactional
    public Aluno atualizar(UUID id, AlunoRequest request) {
        Aluno existente = buscarPorId(id);
        existente.setEmail(request.getEmail());
        existente.setSenhaHash(passwordEncoder.encode(request.getSenhaHash()));
        existente.setNome(request.getNome());
        existente.setCpf(request.getCpf());
        existente.setRg(request.getRg());
        existente.setEndereco(request.getEndereco());
        existente.setCurso(request.getCurso());
        if (request.getInstituicaoId() != null) {
            Instituicao instituicao = instituicaoRepository.findById(request.getInstituicaoId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Instituição não encontrada: " + request.getInstituicaoId()));
            existente.setInstituicao(instituicao);
        }
        return alunoRepository.save(existente);
    }

    @Transactional
    public void deletar(UUID id) {
        Aluno existente = buscarPorId(id);
        alunoRepository.delete(existente);
    }

    public int consultarSaldo(UUID alunoId) {
        return servicoMoeda.consultarSaldoAluno(alunoId);
    }

    public java.util.List<com.merito.sistema_merito.domain.dto.TransacaoEnvioDto> consultarExtrato(UUID alunoId) {
        return servicoMoeda.consultarExtratoAluno(alunoId);
    }

    @Transactional
    public com.merito.sistema_merito.domain.entity.TransacaoResgate resgatar(UUID alunoId, java.util.UUID vantagemId) {
        return servicoResgate.resgatar(alunoId, vantagemId);
    }

    @Transactional
    public java.util.List<com.merito.sistema_merito.domain.dto.ResgateDto> consultarResgates(UUID alunoId) {
        return servicoResgate.consultarResgatesAluno(alunoId).stream()
                .map(r -> new com.merito.sistema_merito.domain.dto.ResgateDto(
                        r.getId(),
                        r.getVantagem().getId(),
                        r.getDataHora(),
                        r.getCupom() != null ? r.getCupom().getCodigoUnico() : null,
                        r.getVantagem().getNome(),
                        r.getVantagem().getCustoMoedas()
                ))
                .toList();
    }
}
