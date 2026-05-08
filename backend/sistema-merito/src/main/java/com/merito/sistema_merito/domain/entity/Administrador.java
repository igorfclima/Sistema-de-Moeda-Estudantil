package com.merito.sistema_merito.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "administradores")
public class Administrador extends Usuario {

    @Column(nullable = false, length = 120)
    private String nome;

    public Administrador() {
    }

    public Administrador(UUID id, String email, String senhaHash, String nome) {
        super(id, email, senhaHash);
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
