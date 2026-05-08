package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.dto.ProfessorRequest;
import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.exception.RecursoNaoEncontradoException;
import com.merito.sistema_merito.repository.InstituicaoRepository;
import com.merito.sistema_merito.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServicoProfessor {

    private final ProfessorRepository professorRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final PasswordEncoder passwordEncoder;

    public ServicoProfessor(ProfessorRepository professorRepository,
                            InstituicaoRepository instituicaoRepository,
                            PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Professor criar(ProfessorRequest request) {
        Instituicao instituicao = instituicaoRepository.findById(request.getInstituicaoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Instituição não encontrada: " + request.getInstituicaoId()));

        Professor professor = new Professor();
        professor.setEmail(request.getEmail());
        professor.setSenhaHash(passwordEncoder.encode(request.getSenhaHash()));
        professor.setNome(request.getNome());
        professor.setCpf(request.getCpf());
        professor.setDepartamento(request.getDepartamento());
        professor.setSaldoMoedas(0);
        professor.setInstituicao(instituicao);
        return professorRepository.save(professor);
    }

    public Professor buscarPorId(UUID id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado: " + id));
    }

    public List<Professor> listarTodos() {
        return professorRepository.findAll();
    }

    @Transactional
    public Professor atualizar(UUID id, ProfessorRequest request) {
        Professor existente = buscarPorId(id);
        Instituicao instituicao = instituicaoRepository.findById(request.getInstituicaoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Instituição não encontrada: " + request.getInstituicaoId()));

        existente.setEmail(request.getEmail());
        existente.setSenhaHash(passwordEncoder.encode(request.getSenhaHash()));
        existente.setNome(request.getNome());
        existente.setCpf(request.getCpf());
        existente.setDepartamento(request.getDepartamento());
        existente.setInstituicao(instituicao);
        return professorRepository.save(existente);
    }

    @Transactional
    public void deletar(UUID id) {
        professorRepository.delete(buscarPorId(id));
    }
}
