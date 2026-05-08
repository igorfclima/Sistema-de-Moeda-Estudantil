package com.merito.sistema_merito.domain.entity;

import com.merito.sistema_merito.domain.enums.StatusVantagem;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "vantagens")
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(name = "custo_moedas", nullable = false)
    private Integer custoMoedas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusVantagem status = StatusVantagem.ATIVA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_parceira_id", nullable = false)
    private EmpresaParceira empresaParceira;

    public Vantagem() {
    }

    public Vantagem(UUID id, String nome, String descricao, String fotoUrl, Integer custoMoedas, StatusVantagem status, EmpresaParceira empresaParceira) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.fotoUrl = fotoUrl;
        this.custoMoedas = custoMoedas;
        this.status = status != null ? status : StatusVantagem.ATIVA;
        this.empresaParceira = empresaParceira;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Integer getCustoMoedas() {
        return custoMoedas;
    }

    public void setCustoMoedas(Integer custoMoedas) {
        this.custoMoedas = custoMoedas;
    }

    public StatusVantagem getStatus() {
        return status;
    }

    public void setStatus(StatusVantagem status) {
        this.status = status;
    }

    public EmpresaParceira getEmpresaParceira() {
        return empresaParceira;
    }

    public void setEmpresaParceira(EmpresaParceira empresaParceira) {
        this.empresaParceira = empresaParceira;
    }
}
