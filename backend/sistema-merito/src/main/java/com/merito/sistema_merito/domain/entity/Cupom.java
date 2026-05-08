package com.merito.sistema_merito.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cupons")
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "codigo_unico", nullable = false, unique = true, length = 80)
    private String codigoUnico;

    @Column(name = "data_geracao", nullable = false)
    private OffsetDateTime dataGeracao;

    @Column(nullable = false)
    private Boolean utilizado = Boolean.FALSE;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transacao_resgate_id", nullable = false, unique = true)
    private TransacaoResgate transacaoResgate;

    public Cupom() {
    }

    public Cupom(UUID id, String codigoUnico, OffsetDateTime dataGeracao, Boolean utilizado, TransacaoResgate transacaoResgate) {
        this.id = id;
        this.codigoUnico = codigoUnico;
        this.dataGeracao = dataGeracao;
        this.utilizado = utilizado != null ? utilizado : Boolean.FALSE;
        this.transacaoResgate = transacaoResgate;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCodigoUnico() {
        return codigoUnico;
    }

    public void setCodigoUnico(String codigoUnico) {
        this.codigoUnico = codigoUnico;
    }

    public OffsetDateTime getDataGeracao() {
        return dataGeracao;
    }

    public void setDataGeracao(OffsetDateTime dataGeracao) {
        this.dataGeracao = dataGeracao;
    }

    public Boolean getUtilizado() {
        return utilizado;
    }

    public void setUtilizado(Boolean utilizado) {
        this.utilizado = utilizado;
    }

    public TransacaoResgate getTransacaoResgate() {
        return transacaoResgate;
    }

    public void setTransacaoResgate(TransacaoResgate transacaoResgate) {
        this.transacaoResgate = transacaoResgate;
    }
}
