package com.merito.sistema_merito.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class AlunoRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String senhaHash;

    @NotBlank
    @Size(max = 120)
    private String nome;

    @NotBlank
    @Size(max = 14)
    private String cpf;

    @NotBlank
    @Size(max = 20)
    private String rg;

    @Size(max = 255)
    private String endereco;

    @NotBlank
    @Size(max = 120)
    private String curso;

    @NotNull
    private UUID instituicaoId;

    public AlunoRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
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

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public UUID getInstituicaoId() {
        return instituicaoId;
    }

    public void setInstituicaoId(UUID instituicaoId) {
        this.instituicaoId = instituicaoId;
    }
}
