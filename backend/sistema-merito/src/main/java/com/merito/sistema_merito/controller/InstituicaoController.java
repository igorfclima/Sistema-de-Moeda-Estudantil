package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.dto.InstituicaoDto;
import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.repository.InstituicaoRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoRepository instituicaoRepository;

    public InstituicaoController(InstituicaoRepository instituicaoRepository) {
        this.instituicaoRepository = instituicaoRepository;
    }

    @GetMapping
    public ResponseEntity<List<InstituicaoDto>> listar() {
        List<InstituicaoDto> instituicoes = instituicaoRepository.findAll().stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(instituicoes);
    }

    private InstituicaoDto toDto(Instituicao instituicao) {
        return new InstituicaoDto(instituicao.getId(), instituicao.getNome(), instituicao.getCnpj(), instituicao.getAtiva());
    }
}