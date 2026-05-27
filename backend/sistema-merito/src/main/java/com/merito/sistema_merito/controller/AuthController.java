package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.dto.LoginRequest;
import com.merito.sistema_merito.domain.dto.LoginResponse;
import com.merito.sistema_merito.domain.entity.Administrador;
import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.domain.entity.Usuario;
import com.merito.sistema_merito.security.JwtService;
import com.merito.sistema_merito.security.UsuarioPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    // Sem rate limit aqui. Sem proteção contra força bruta.
    // Implemente verificação de tentativas falhadas com bloqueio temporário.
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha()));

        UsuarioPrincipal principal = (UsuarioPrincipal) authentication.getPrincipal();
        Usuario usuario = principal.getUsuario();
        String nome = extrairNome(usuario);

        return ResponseEntity.ok(new LoginResponse(
                jwtService.gerarToken(principal),
                principal.getRoleName(),
                usuario.getId(),
                nome,
                usuario.getEmail()));
    }

    private String extrairNome(Usuario usuario) {
        if (usuario instanceof Aluno aluno) {
            return aluno.getNome();
        }
        if (usuario instanceof Professor professor) {
            return professor.getNome();
        }
        if (usuario instanceof EmpresaParceira empresaParceira) {
            return empresaParceira.getNomeEmpresa();
        }
        if (usuario instanceof Administrador administrador) {
            return administrador.getNome();
        }
        return usuario.getEmail();
    }
}
