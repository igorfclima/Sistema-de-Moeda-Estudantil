package com.merito.sistema_merito.domain.entity;

import com.merito.sistema_merito.domain.enums.TipoNotificacao;
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
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "notificacoes")
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "email_destino", nullable = false, length = 150)
    private String emailDestino;

    @Column(nullable = false, length = 180)
    private String assunto;

    @Column(nullable = false, length = 1000)
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoNotificacao tipo;

    @Column(name = "enviada_em", nullable = false)
    private OffsetDateTime enviadaEm = OffsetDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_parceira_id")
    private EmpresaParceira empresaParceira;

    public Notificacao() {
    }

    public Notificacao(UUID id, String emailDestino, String assunto, String mensagem, TipoNotificacao tipo, OffsetDateTime enviadaEm, Aluno aluno, EmpresaParceira empresaParceira) {
        this.id = id;
        this.emailDestino = emailDestino;
        this.assunto = assunto;
        this.mensagem = mensagem;
        this.tipo = tipo;
        this.enviadaEm = enviadaEm != null ? enviadaEm : OffsetDateTime.now();
        this.aluno = aluno;
        this.empresaParceira = empresaParceira;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmailDestino() {
        return emailDestino;
    }

    public void setEmailDestino(String emailDestino) {
        this.emailDestino = emailDestino;
    }

    public String getAssunto() {
        return assunto;
    }

    public void setAssunto(String assunto) {
        this.assunto = assunto;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public TipoNotificacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoNotificacao tipo) {
        this.tipo = tipo;
    }

    public OffsetDateTime getEnviadaEm() {
        return enviadaEm;
    }

    public void setEnviadaEm(OffsetDateTime enviadaEm) {
        this.enviadaEm = enviadaEm;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public EmpresaParceira getEmpresaParceira() {
        return empresaParceira;
    }

    public void setEmpresaParceira(EmpresaParceira empresaParceira) {
        this.empresaParceira = empresaParceira;
    }
}
