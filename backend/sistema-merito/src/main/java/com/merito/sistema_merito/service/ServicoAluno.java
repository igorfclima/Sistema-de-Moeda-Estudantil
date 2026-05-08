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

    public ServicoAluno(AlunoRepository alunoRepository, InstituicaoRepository instituicaoRepository, PasswordEncoder passwordEncoder) {
        this.alunoRepository = alunoRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Aluno criar(AlunoRequest request) {
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
}
