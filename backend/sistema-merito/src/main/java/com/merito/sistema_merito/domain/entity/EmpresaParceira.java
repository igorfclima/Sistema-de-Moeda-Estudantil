package com.merito.sistema_merito.domain.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "empresas_parceiras")
public class EmpresaParceira extends Usuario {

    @Column(name = "nome_empresa", nullable = false, length = 150)
    private String nomeEmpresa;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(length = 255)
    private String descricao;

    @OneToMany(mappedBy = "empresaParceira", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vantagem> vantagens = new ArrayList<>();

    public EmpresaParceira() {
    }

    public EmpresaParceira(UUID id, String email, String senhaHash, String nomeEmpresa, String cnpj, String descricao, List<Vantagem> vantagens) {
        super(id, email, senhaHash);
        this.nomeEmpresa = nomeEmpresa;
        this.cnpj = cnpj;
        this.descricao = descricao;
        this.vantagens = vantagens != null ? vantagens : new ArrayList<>();
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<Vantagem> getVantagens() {
        return vantagens;
    }

    public void setVantagens(List<Vantagem> vantagens) {
        this.vantagens = vantagens;
    }
}
