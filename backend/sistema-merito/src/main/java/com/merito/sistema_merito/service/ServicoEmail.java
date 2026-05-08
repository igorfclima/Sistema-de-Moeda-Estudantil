package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.Cupom;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.domain.entity.Notificacao;
import com.merito.sistema_merito.domain.entity.TransacaoEnvio;
import com.merito.sistema_merito.domain.enums.TipoNotificacao;
import com.merito.sistema_merito.repository.NotificacaoRepository;
import java.time.OffsetDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Deprecated // Desabilitado até configuração de email
//@Service
public class ServicoEmail {

    private static final Logger log = LoggerFactory.getLogger(ServicoEmail.class);

    private final JavaMailSender mailSender;
    private final NotificacaoRepository notificacaoRepository;

    private static final String EMAIL_REMETENTE = "noreply@sistemamerito.com";

    public ServicoEmail(JavaMailSender mailSender, NotificacaoRepository notificacaoRepository) {
        this.mailSender = mailSender;
        this.notificacaoRepository = notificacaoRepository;
    }

    /**
     * Envia notificação de recebimento de moedas para o aluno.
     *
     * @param aluno    Aluno que recebeu as moedas
     * @param transacao Transação de envio de moedas
     */
    @Transactional
    public void enviarNotificacaoRecebimento(Aluno aluno, TransacaoEnvio transacao) {
        String assunto = "🎉 Você recebeu moedas no Sistema de Mérito!";
        String mensagem = String.format(
                "Parabéns!\n\n" +
                "Você recebeu %d moedas de reconhecimento!\n\n" +
                "Professor: %s\n" +
                "Motivo: %s\n\n" +
                "Seu saldo atual: %d moedas\n\n" +
                "Visite a plataforma para consultar sua conta e resgatar vantagens.",
                transacao.getQuantidade(),
                transacao.getProfessor().getNome(),
                transacao.getMotivo(),
                aluno.getSaldoMoedas()
        );

        enviarEmail(aluno.getEmail(), assunto, mensagem, TipoNotificacao.RECEBIMENTO_MOEDAS, aluno, null);

        log.info("Email de recebimento de moedas enviado para: {}", aluno.getEmail());
    }

    /**
     * Envia cupom de resgate para o aluno.
     *
     * @param aluno Aluno que resgatou a vantagem
     * @param cupom Cupom gerado
     */
    @Transactional
    public void enviarCupomAluno(Aluno aluno, Cupom cupom) {
        String vantagem = cupom.getTransacaoResgate().getVantagem().getNome();
        String assunto = "✅ Seu cupom de resgate foi gerado!";
        String mensagem = String.format(
                "Seu cupom de resgate foi gerado com sucesso!\n\n" +
                "Vantagem: %s\n" +
                "Código do Cupom: %s\n" +
                "Gerado em: %s\n\n" +
                "Apresente este código para utilizar a vantagem.\n" +
                "⚠️ Este cupom é intransferível e de uso único.",
                vantagem,
                cupom.getCodigoUnico(),
                cupom.getDataGeracao()
        );

        enviarEmail(aluno.getEmail(), assunto, mensagem, TipoNotificacao.CUPOM_GERADO, aluno, null);

        log.info("Cupom enviado para aluno: {} - Código: {}", aluno.getEmail(), cupom.getCodigoUnico());
    }

    /**
     * Envia notificação de resgate para a empresa parceira.
     *
     * @param empresa Empresa parceira
     * @param cupom   Cupom gerado
     */
    @Transactional
    public void enviarNotificacaoEmpresa(EmpresaParceira empresa, Cupom cupom) {
        String vantagem = cupom.getTransacaoResgate().getVantagem().getNome();
        String aluno = cupom.getTransacaoResgate().getAluno().getNome();

        String assunto = "📋 Novo resgate de cupom no Sistema de Mérito";
        String mensagem = String.format(
                "Uma nova vantagem foi resgatada!\n\n" +
                "Aluno: %s\n" +
                "Vantagem: %s\n" +
                "Código do Cupom: %s\n" +
                "Data/Hora: %s\n\n" +
                "Verifique a plataforma para mais detalhes.",
                aluno,
                vantagem,
                cupom.getCodigoUnico(),
                cupom.getDataGeracao()
        );

        enviarEmail(empresa.getEmail(), assunto, mensagem, TipoNotificacao.CONFIRMACAO_RESGATE, null, empresa);

        log.info("Notificação de resgate enviada para empresa: {} - Cupom: {}", empresa.getEmail(), cupom.getCodigoUnico());
    }

    /**
     * Método auxiliar para enviar email e registrar notificação no banco de dados.
     *
     * @param emailDestino    Email do destinatário
     * @param assunto         Assunto do email
     * @param mensagem        Corpo da mensagem
     * @param tipo            Tipo de notificação
     * @param aluno           Aluno relacionado (pode ser null)
     * @param empresa         Empresa relacionada (pode ser null)
     */
    private void enviarEmail(String emailDestino, String assunto, String mensagem,
                             TipoNotificacao tipo, Aluno aluno, EmpresaParceira empresa) {
        try {
            // Envia email via SMTP
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(EMAIL_REMETENTE);
            mail.setTo(emailDestino);
            mail.setSubject(assunto);
            mail.setText(mensagem);

            mailSender.send(mail);

            // Registra notificação no banco de dados
            Notificacao notificacao = new Notificacao(null, emailDestino, assunto, mensagem, tipo, OffsetDateTime.now(), aluno, empresa);

            notificacaoRepository.save(notificacao);

            log.info("Email enviado com sucesso para: {}", emailDestino);
        } catch (Exception e) {
            log.error("Erro ao enviar email para: {} - Erro: {}", emailDestino, e.getMessage(), e);

            // Registra notificação mesmo se falhar (para auditoria)
            Notificacao notificacao = new Notificacao(null, emailDestino, assunto, mensagem + "\n\n[ERRO AO ENVIAR - será retentado]", tipo, OffsetDateTime.now(), aluno, empresa);

            notificacaoRepository.save(notificacao);
        }
    }
}
