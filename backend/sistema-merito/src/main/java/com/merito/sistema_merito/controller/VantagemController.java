package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.dto.VantagemDto;
import com.merito.sistema_merito.domain.dto.VantagemRequest;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.domain.entity.Vantagem;
import com.merito.sistema_merito.domain.enums.StatusVantagem;
import com.merito.sistema_merito.exception.RecursoNaoEncontradoException;
import com.merito.sistema_merito.repository.EmpresaParceiraRepository;
import com.merito.sistema_merito.repository.VantagemRepository;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;

    public VantagemController(VantagemRepository vantagemRepository,
                              EmpresaParceiraRepository empresaParceiraRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaParceiraRepository = empresaParceiraRepository;
    }

    @GetMapping
    public ResponseEntity<List<VantagemDto>> listarAtivas() {
        List<VantagemDto> list = vantagemRepository.findByStatus(StatusVantagem.ATIVA).stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<VantagemDto>> listarTodas() {
        return ResponseEntity.ok(vantagemRepository.findAll().stream().map(this::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemDto> buscar(@PathVariable UUID id) {
        Vantagem v = vantagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada: " + id));
        return ResponseEntity.ok(toDto(v));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<VantagemDto> criar(@RequestBody VantagemRequest request) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(request.empresaParceiraId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Empresa parceira não encontrada: " + request.empresaParceiraId()));

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(request.nome() != null ? request.nome() : request.descricao());
        vantagem.setDescricao(request.descricao());
        vantagem.setFotoUrl(request.fotoUrl());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setStatus(request.status() != null ? request.status() : StatusVantagem.ATIVA);
        vantagem.setEmpresaParceira(empresa);

        vantagem = vantagemRepository.save(vantagem);
        return ResponseEntity.created(URI.create("/api/vantagens/" + vantagem.getId()))
                .body(toDto(vantagem));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<VantagemDto> atualizar(@PathVariable UUID id, @RequestBody VantagemRequest request) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada: " + id));

        if (request.nome() != null) vantagem.setNome(request.nome());
        if (request.descricao() != null) vantagem.setDescricao(request.descricao());
        if (request.fotoUrl() != null) vantagem.setFotoUrl(request.fotoUrl());
        if (request.custoMoedas() != null) vantagem.setCustoMoedas(request.custoMoedas());
        if (request.status() != null) vantagem.setStatus(request.status());

        vantagem = vantagemRepository.save(vantagem);
        return ResponseEntity.ok(toDto(vantagem));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        vantagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada: " + id));
        vantagemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private VantagemDto toDto(Vantagem v) {
        return new VantagemDto(v.getId(), v.getNome(), v.getDescricao(), v.getFotoUrl(),
                v.getCustoMoedas(), v.getStatus(), v.getEmpresaParceira().getId());
    }
}
