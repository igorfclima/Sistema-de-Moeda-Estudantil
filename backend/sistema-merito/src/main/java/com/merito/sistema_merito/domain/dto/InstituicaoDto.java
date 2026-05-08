package com.merito.sistema_merito.domain.dto;

import java.util.UUID;

public class InstituicaoDto {

    private UUID id;
    private String nome;
    private String cnpj;
    private Boolean ativa;

    public InstituicaoDto() {
    }

    public InstituicaoDto(UUID id, String nome, String cnpj, Boolean ativa) {
        this.id = id;
        this.nome = nome;
        this.cnpj = cnpj;
        this.ativa = ativa;
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

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }
}