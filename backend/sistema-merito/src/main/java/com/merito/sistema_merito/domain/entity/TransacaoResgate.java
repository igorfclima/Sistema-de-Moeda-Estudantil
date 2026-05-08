package com.merito.sistema_merito.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "transacoes_resgate")
public class TransacaoResgate extends Transacao {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem vantagem;

    @OneToOne(mappedBy = "transacaoResgate", fetch = FetchType.LAZY)
    private Cupom cupom;

    public TransacaoResgate() {
    }

    public TransacaoResgate(UUID id, OffsetDateTime dataHora, Integer quantidade, Aluno aluno, Vantagem vantagem, Cupom cupom) {
        super(id, dataHora, quantidade);
        this.aluno = aluno;
        this.vantagem = vantagem;
        this.cupom = cupom;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Vantagem getVantagem() {
        return vantagem;
    }

    public void setVantagem(Vantagem vantagem) {
        this.vantagem = vantagem;
    }

    public Cupom getCupom() {
        return cupom;
    }

    public void setCupom(Cupom cupom) {
        this.cupom = cupom;
    }
}
