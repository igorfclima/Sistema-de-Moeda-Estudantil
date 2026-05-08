package com.merito.sistema_merito.security;

import com.merito.sistema_merito.domain.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${app.jwt.secret:VGVzdGUtS2V5LVN1cGVyLXNlY3JldC0zMmNoYXJzISE}")
    private String secret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long expirationMs;

    public String gerarToken(UsuarioPrincipal principal) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", principal.getRoleName());
        claims.put("email", principal.getUsername());
        claims.put("userId", principal.getUsuario().getId() != null ? principal.getUsuario().getId().toString() : null);
        return gerarToken(claims, principal.getUsername());
    }

    public String extrairUsername(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public boolean validarToken(String token, Usuario usuario) {
        String username = extrairUsername(token);
        return username != null && username.equals(usuario.getEmail()) && !tokenExpirado(token);
    }

    private <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extrairTodosOsClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extrairTodosOsClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String gerarToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private boolean tokenExpirado(String token) {
        Date expiration = extrairClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.matches("^[A-Za-z0-9+/=]+$")
                ? Decoders.BASE64.decode(secret)
                : secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
