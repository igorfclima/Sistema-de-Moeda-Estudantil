package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.dto.EmpresaParceiraRequest;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.exception.RecursoNaoEncontradoException;
import com.merito.sistema_merito.repository.EmpresaParceiraRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ServicoEmpresaParceira {

    private final EmpresaParceiraRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public ServicoEmpresaParceira(EmpresaParceiraRepository empresaRepository, PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public EmpresaParceira criar(EmpresaParceiraRequest request) {
        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setEmail(request.getEmail());
        empresa.setSenhaHash(passwordEncoder.encode(request.getSenhaHash()));
        empresa.setNomeEmpresa(request.getNomeEmpresa());
        empresa.setCnpj(request.getCnpj());
        empresa.setDescricao(request.getDescricao());
        return empresaRepository.save(empresa);
    }

    public EmpresaParceira buscarPorId(UUID id) {
        return empresaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("EmpresaParceira não encontrada: " + id));
    }

    public List<EmpresaParceira> listarTodos() {
        return empresaRepository.findAll();
    }

    @Transactional
    public EmpresaParceira atualizar(UUID id, EmpresaParceiraRequest request) {
        EmpresaParceira existente = buscarPorId(id);
        existente.setEmail(request.getEmail());
        existente.setSenhaHash(passwordEncoder.encode(request.getSenhaHash()));
        existente.setNomeEmpresa(request.getNomeEmpresa());
        existente.setCnpj(request.getCnpj());
        existente.setDescricao(request.getDescricao());
        return empresaRepository.save(existente);
    }

    @Transactional
    public void deletar(UUID id) {
        EmpresaParceira existente = buscarPorId(id);
        empresaRepository.delete(existente);
    }
}
