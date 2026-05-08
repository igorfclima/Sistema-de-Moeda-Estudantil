package com.merito.sistema_merito.domain.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "instituicoes")
public class Instituicao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(nullable = false)
    private Boolean ativa = Boolean.TRUE;

    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL)
    private List<Professor> professores = new ArrayList<>();

    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL)
    private List<Aluno> alunos = new ArrayList<>();

    public Instituicao() {
    }

    public Instituicao(UUID id, String nome, String cnpj, Boolean ativa, List<Professor> professores, List<Aluno> alunos) {
        this.id = id;
        this.nome = nome;
        this.cnpj = cnpj;
        this.ativa = ativa != null ? ativa : Boolean.TRUE;
        this.professores = professores != null ? professores : new ArrayList<>();
        this.alunos = alunos != null ? alunos : new ArrayList<>();
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

    public List<Professor> getProfessores() {
        return professores;
    }

    public void setProfessores(List<Professor> professores) {
        this.professores = professores;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }
}
