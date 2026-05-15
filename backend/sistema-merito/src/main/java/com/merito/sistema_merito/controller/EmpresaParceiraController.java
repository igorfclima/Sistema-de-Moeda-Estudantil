package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.dto.EmpresaParceiraRequest;
import com.merito.sistema_merito.domain.dto.EmpresaParceiraDto;
import com.merito.sistema_merito.domain.dto.EmpresaResgateDto;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.service.ServicoEmpresaParceira;
import com.merito.sistema_merito.service.ServicoResgate;
import jakarta.validation.Valid;
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
@RequestMapping("/api/empresas")
public class EmpresaParceiraController {

    private final ServicoEmpresaParceira servico;
    private final ServicoResgate servicoResgate;

    public EmpresaParceiraController(ServicoEmpresaParceira servico, ServicoResgate servicoResgate) {
        this.servico = servico;
        this.servicoResgate = servicoResgate;
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraDto> criar(@Valid @RequestBody EmpresaParceiraRequest request) {
        EmpresaParceira criado = servico.criar(request);
        URI location = URI.create("/api/empresas/" + criado.getId());
        return ResponseEntity.created(location).body(toDto(criado));
    }

    @GetMapping
    public ResponseEntity<List<EmpresaParceiraDto>> listar() {
        return ResponseEntity.ok(servico.listarTodos().stream().map(this::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaParceiraDto> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(toDto(servico.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaParceiraDto> atualizar(@PathVariable UUID id, @Valid @RequestBody EmpresaParceiraRequest request) {
        return ResponseEntity.ok(toDto(servico.atualizar(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        servico.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/resgates")
    @Transactional(readOnly = true)
    public ResponseEntity<List<EmpresaResgateDto>> resgates(@PathVariable UUID id) {
        List<EmpresaResgateDto> lista = servicoResgate.consultarResgatesEmpresa(id)
                .stream()
                .map(r -> new EmpresaResgateDto(
                        r.getId(),
                        r.getDataHora(),
                        r.getCupom() != null ? r.getCupom().getCodigoUnico() : null,
                        r.getAluno().getNome(),
                        r.getVantagem().getNome(),
                        r.getQuantidade()
                ))
                .toList();
        return ResponseEntity.ok(lista);
    }

    private EmpresaParceiraDto toDto(EmpresaParceira empresa) {
        return new EmpresaParceiraDto(empresa.getId(), empresa.getNomeEmpresa(), empresa.getEmail(), empresa.getCnpj(), empresa.getDescricao());
    }
}
