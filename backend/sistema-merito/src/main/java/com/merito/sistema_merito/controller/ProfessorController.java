package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.dto.ProfessorDto;
import com.merito.sistema_merito.domain.dto.ProfessorRequest;
import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.service.ServicoProfessor;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ServicoProfessor servicoProfessor;

    public ProfessorController(ServicoProfessor servicoProfessor) {
        this.servicoProfessor = servicoProfessor;
    }

    @PostMapping
    public ResponseEntity<ProfessorDto> criar(@Valid @RequestBody ProfessorRequest request) {
        Professor criado = servicoProfessor.criar(request);
        return ResponseEntity.created(URI.create("/api/professores/" + criado.getId())).body(toDto(criado));
    }

    @GetMapping
    public ResponseEntity<List<ProfessorDto>> listar() {
        return ResponseEntity.ok(servicoProfessor.listarTodos().stream().map(this::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDto> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(toDto(servicoProfessor.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDto> atualizar(@PathVariable UUID id, @Valid @RequestBody ProfessorRequest request) {
        return ResponseEntity.ok(toDto(servicoProfessor.atualizar(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        servicoProfessor.deletar(id);
        return ResponseEntity.noContent().build();
    }

    private ProfessorDto toDto(Professor professor) {
        UUID instituicaoId = null;
        Instituicao instituicao = professor.getInstituicao();
        if (instituicao != null) {
            instituicaoId = instituicao.getId();
        }
        return new ProfessorDto(professor.getId(), professor.getNome(), professor.getEmail(), professor.getCpf(), professor.getDepartamento(), professor.getSaldoMoedas(), instituicaoId);
    }
}
