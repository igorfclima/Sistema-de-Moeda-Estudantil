package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.dto.AlunoRequest;
import com.merito.sistema_merito.domain.dto.AlunoDto;
import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.service.ServicoAluno;
import com.merito.sistema_merito.domain.entity.Instituicao;
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
@RequestMapping("/api/alunos")
public class AlunoController {

    private final ServicoAluno servicoAluno;

    public AlunoController(ServicoAluno servicoAluno) {
        this.servicoAluno = servicoAluno;
    }

    @PostMapping
    public ResponseEntity<AlunoDto> criar(@Valid @RequestBody AlunoRequest request) {
        Aluno criado = servicoAluno.criar(request);
        URI location = URI.create("/api/alunos/" + criado.getId());
        return ResponseEntity.created(location).body(toDto(criado));
    }

    @GetMapping
    public ResponseEntity<List<AlunoDto>> listar() {
        return ResponseEntity.ok(servicoAluno.listarTodos().stream().map(this::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoDto> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(toDto(servicoAluno.buscarPorId(id)));
    }

    @GetMapping("/{id}/saldo")
    public ResponseEntity<Integer> saldo(@PathVariable UUID id) {
        return ResponseEntity.ok(servicoAluno.consultarSaldo(id));
    }

    @GetMapping("/{id}/extrato")
    public ResponseEntity<List<com.merito.sistema_merito.domain.dto.TransacaoEnvioDto>> extrato(@PathVariable UUID id) {
        return ResponseEntity.ok(servicoAluno.consultarExtrato(id));
    }

    @GetMapping("/{id}/resgates")
    public ResponseEntity<List<com.merito.sistema_merito.domain.dto.ResgateDto>> resgates(@PathVariable UUID id) {
        return ResponseEntity.ok(servicoAluno.consultarResgates(id));
    }

    @PostMapping("/{id}/resgatar")
    public ResponseEntity<com.merito.sistema_merito.domain.dto.ResgateDto> resgatar(@PathVariable UUID id, @Valid @RequestBody com.merito.sistema_merito.domain.dto.ResgatarVantagemRequest request) {
        var transacao = servicoAluno.resgatar(id, request.vantagemId());
        var dto = new com.merito.sistema_merito.domain.dto.ResgateDto(
                transacao.getId(),
                transacao.getVantagem().getId(),
                transacao.getDataHora(),
                transacao.getCupom() != null ? transacao.getCupom().getCodigoUnico() : null,
                transacao.getVantagem().getNome(),
                transacao.getVantagem().getCustoMoedas()
        );
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoDto> atualizar(@PathVariable UUID id, @Valid @RequestBody AlunoRequest request) {
        return ResponseEntity.ok(toDto(servicoAluno.atualizar(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        servicoAluno.deletar(id);
        return ResponseEntity.noContent().build();
    }

    private AlunoDto toDto(Aluno aluno) {
        UUID instituicaoId = null;
        Instituicao instituicao = aluno.getInstituicao();
        if (instituicao != null) {
            instituicaoId = instituicao.getId();
        }
        return new AlunoDto(aluno.getId(), aluno.getNome(), aluno.getEmail(), aluno.getCpf(), aluno.getCurso(), aluno.getSaldoMoedas(), instituicaoId);
    }
}
