package com.merito.sistema_merito.security;

import com.merito.sistema_merito.domain.entity.Usuario;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsuarioPrincipal implements UserDetails {

    private final Usuario usuario;

    public UsuarioPrincipal(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(getRoleName()));
    }

    @Override
    public String getPassword() {
        return usuario.getSenhaHash();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getRoleName() {
        if (usuario instanceof com.merito.sistema_merito.domain.entity.Aluno) {
            return "ROLE_ALUNO";
        }
        if (usuario instanceof com.merito.sistema_merito.domain.entity.Professor) {
            return "ROLE_PROFESSOR";
        }
        if (usuario instanceof com.merito.sistema_merito.domain.entity.EmpresaParceira) {
            return "ROLE_EMPRESA";
        }
        if (usuario instanceof com.merito.sistema_merito.domain.entity.Administrador) {
            return "ROLE_ADMIN";
        }
        return "ROLE_USUARIO";
    }
}
