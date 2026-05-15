package com.merito.sistema_merito.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "professores")
public class Professor extends Usuario {

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false, length = 120)
    private String departamento;

    @Column(name = "saldo_moedas", nullable = false)
    private Integer saldoMoedas;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id", nullable = false)
    private Instituicao instituicao;

    public Professor() {
    }

    public Professor(UUID id, String email, String senhaHash, String nome, String cpf, String departamento, Integer saldoMoedas, Instituicao instituicao) {
        super(id, email, senhaHash);
        this.nome = nome;
        this.cpf = cpf;
        this.departamento = departamento;
        this.saldoMoedas = saldoMoedas;
        this.instituicao = instituicao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public Integer getSaldoMoedas() {
        return saldoMoedas;
    }

    public void setSaldoMoedas(Integer saldoMoedas) {
        this.saldoMoedas = saldoMoedas;
    }

    public Instituicao getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(Instituicao instituicao) {
        this.instituicao = instituicao;
    }
}
