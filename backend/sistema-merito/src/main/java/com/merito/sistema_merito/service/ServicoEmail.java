package com.merito.sistema_merito.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.Cupom;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.domain.entity.Notificacao;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.domain.entity.TransacaoEnvio;
import com.merito.sistema_merito.domain.enums.TipoNotificacao;
import com.merito.sistema_merito.repository.NotificacaoRepository;
import jakarta.mail.internet.MimeMessage;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import javax.imageio.ImageIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicoEmail {

    private static final Logger log = LoggerFactory.getLogger(ServicoEmail.class);

    private final JavaMailSender mailSender;
    private final NotificacaoRepository notificacaoRepository;
    private final String emailRemetente;

    public ServicoEmail(
            @org.springframework.beans.factory.annotation.Autowired(required = false) JavaMailSender mailSender,
            NotificacaoRepository notificacaoRepository,
            @Value("${app.mail.from:noreply@sistemamerito.com}") String emailRemetente) {
        this.mailSender = mailSender;
        this.notificacaoRepository = notificacaoRepository;
        this.emailRemetente = emailRemetente;
    }

    // ── Métodos públicos ──────────────────────────────────────────────────────

    @Transactional
    public void enviarConfirmacaoProfessor(Professor professor, TransacaoEnvio transacao) {
        String assunto = "Confirmação: Moedas enviadas com sucesso";
        String html = templateProfessorEnvio(professor, transacao);
        String texto = String.format("Você enviou %d moedas para %s. Motivo: %s. Saldo restante: %d moedas.",
                transacao.getQuantidade(), transacao.getAluno().getNome(),
                transacao.getMotivo(), professor.getSaldoMoedas());
        enviarHtml(professor.getEmail(), assunto, html, texto, TipoNotificacao.ENVIO_MOEDAS, null, null);
        log.info("Confirmação de envio enviada para professor: {}", professor.getEmail());
    }

    @Transactional
    public void enviarNotificacaoRecebimento(Aluno aluno, TransacaoEnvio transacao) {
        String assunto = "Você recebeu moedas no Sistema de Mérito!";
        String html = templateAlunoRecebimento(aluno, transacao);
        String texto = String.format("Você recebeu %d moedas do professor %s. Motivo: %s. Saldo atual: %d moedas.",
                transacao.getQuantidade(), transacao.getProfessor().getNome(),
                transacao.getMotivo(), aluno.getSaldoMoedas());
        enviarHtml(aluno.getEmail(), assunto, html, texto, TipoNotificacao.RECEBIMENTO_MOEDAS, aluno, null);
        log.info("Notificação de recebimento enviada para aluno: {}", aluno.getEmail());
    }

    @Transactional
    public void enviarCupomAluno(Aluno aluno, Cupom cupom) {
        String assunto = "Seu cupom de resgate foi gerado!";
        String html = templateCupomAluno(aluno, cupom);
        String texto = String.format("Cupom gerado! Vantagem: %s. Código: %s.",
                cupom.getTransacaoResgate().getVantagem().getNome(), cupom.getCodigoUnico());
        byte[] qr = gerarQrCode(cupom.getCodigoUnico());
        enviarHtmlComQr(aluno.getEmail(), assunto, html, texto, qr, TipoNotificacao.CUPOM_GERADO, aluno, null);
        log.info("Cupom enviado para aluno: {} - Código: {}", aluno.getEmail(), cupom.getCodigoUnico());
    }

    @Transactional
    public void enviarNotificacaoEmpresa(EmpresaParceira empresa, Cupom cupom) {
        String assunto = "Novo resgate de cupom - Sistema de Mérito";
        String html = templateCupomEmpresa(empresa, cupom);
        String texto = String.format("Novo resgate! Aluno: %s. Vantagem: %s. Código: %s.",
                cupom.getTransacaoResgate().getAluno().getNome(),
                cupom.getTransacaoResgate().getVantagem().getNome(),
                cupom.getCodigoUnico());
        byte[] qr = gerarQrCode(cupom.getCodigoUnico());
        enviarHtmlComQr(empresa.getEmail(), assunto, html, texto, qr, TipoNotificacao.CONFIRMACAO_RESGATE, null, empresa);
        log.info("Notificação enviada para empresa: {} - Cupom: {}", empresa.getEmail(), cupom.getCodigoUnico());
    }

    @Transactional
    public void enviarPdfAnexo(String emailDestino, String assunto, String mensagemTexto,
                               byte[] pdfBytes, String filename, TipoNotificacao tipo) {
        try {
            if (mailSender != null) {
                MimeMessage mime = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
                helper.setFrom(emailRemetente);
                helper.setTo(emailDestino);
                helper.setSubject(assunto);
                helper.setText(mensagemTexto != null ? mensagemTexto : "");
                helper.addAttachment(filename != null ? filename : "document.pdf",
                        new ByteArrayResource(pdfBytes));
                mailSender.send(mime);
            } else {
                log.info("MailSender não configurado — simulando envio (PDF) para {}", emailDestino);
            }
            salvarNotificacao(emailDestino, assunto, mensagemTexto, tipo, null, null);
        } catch (Exception e) {
            log.error("Erro ao enviar PDF para: {}", emailDestino, e);
            salvarNotificacao(emailDestino, assunto, mensagemTexto + "\n[ERRO AO ENVIAR]", tipo, null, null);
        }
    }

    // ── Remetentes internos ───────────────────────────────────────────────────

    private void enviarHtml(String to, String subject, String html, String texto,
                            TipoNotificacao tipo, Aluno aluno, EmpresaParceira empresa) {
        try {
            if (mailSender != null) {
                MimeMessage mime = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mime, false, "UTF-8");
                helper.setFrom(emailRemetente);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(html, true);
                mailSender.send(mime);
            } else {
                log.info("MailSender não configurado — simulando envio para {}", to);
            }
            salvarNotificacao(to, subject, texto, tipo, aluno, empresa);
        } catch (Exception e) {
            log.error("Erro ao enviar email para: {}", to, e);
            salvarNotificacao(to, subject, texto + "\n[ERRO AO ENVIAR]", tipo, aluno, empresa);
        }
    }

    private void enviarHtmlComQr(String to, String subject, String html, String texto,
                                 byte[] qrBytes, TipoNotificacao tipo,
                                 Aluno aluno, EmpresaParceira empresa) {
        try {
            if (mailSender != null) {
                MimeMessage mime = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
                helper.setFrom(emailRemetente);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(html, true);
                if (qrBytes != null) {
                    helper.addInline("qrcode", new ByteArrayResource(qrBytes), "image/png");
                }
                mailSender.send(mime);
            } else {
                log.info("MailSender não configurado — simulando envio com QR para {}", to);
            }
            salvarNotificacao(to, subject, texto, tipo, aluno, empresa);
        } catch (Exception e) {
            log.error("Erro ao enviar email com QR para: {}", to, e);
            salvarNotificacao(to, subject, texto + "\n[ERRO AO ENVIAR]", tipo, aluno, empresa);
        }
    }

    private void salvarNotificacao(String emailDestino, String assunto, String mensagem,
                                   TipoNotificacao tipo, Aluno aluno, EmpresaParceira empresa) {
        try {
            String msg = mensagem != null && mensagem.length() > 990
                    ? mensagem.substring(0, 990) : mensagem;
            notificacaoRepository.save(new Notificacao(
                    null, emailDestino, assunto, msg, tipo, OffsetDateTime.now(), aluno, empresa));
        } catch (Exception ex) {
            log.error("Erro ao salvar notificação no banco", ex);
        }
    }

    // ── QR Code ───────────────────────────────────────────────────────────────

    private byte[] gerarQrCode(String conteudo) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(conteudo, BarcodeFormat.QR_CODE, 200, 200);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            return baos.toByteArray();
        } catch (WriterException | IOException e) {
            log.error("Erro ao gerar QR Code para: {}", conteudo, e);
            return null;
        }
    }

    // ── Templates HTML ────────────────────────────────────────────────────────

    private static String baseHtml(String titulo, String corHeader, String conteudo) {
        return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">"
                + "<style>"
                + "body{margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4}"
                + ".wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;"
                + "overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12)}"
                + ".hd{background:" + corHeader + ";padding:28px 32px;color:#fff}"
                + ".hd h1{margin:0;font-size:20px;font-weight:700}"
                + ".hd p{margin:6px 0 0;font-size:13px;opacity:.85}"
                + ".bd{padding:28px 32px}"
                + ".f{margin-bottom:18px}"
                + ".lb{font-size:11px;font-weight:700;text-transform:uppercase;color:#999;letter-spacing:.5px}"
                + ".vl{font-size:15px;color:#222;margin-top:4px}"
                + ".badge{display:inline-block;background:#ede9fe;color:#6d28d9;"
                + "font-size:14px;font-weight:700;padding:5px 14px;border-radius:20px}"
                + ".code-box{background:#f5f3ff;border:2px dashed #7c3aed;border-radius:8px;"
                + "padding:18px 24px;text-align:center;margin:22px 0}"
                + ".code{font-size:24px;font-weight:700;color:#6d28d9;letter-spacing:4px;font-family:monospace}"
                + ".qr-box{text-align:center;margin:20px 0}"
                + ".qr-box img{border:1px solid #e5e7eb;border-radius:6px;padding:8px;background:#fff}"
                + ".warn{font-size:12px;color:#dc2626;margin-top:16px}"
                + ".hint{font-size:13px;color:#666;margin-top:16px}"
                + ".ft{background:#f9fafb;padding:14px 32px;border-top:1px solid #e5e7eb;"
                + "font-size:11px;color:#aaa;text-align:center}"
                + "</style></head><body>"
                + "<div class=\"wrap\">"
                + "<div class=\"hd\"><h1>" + titulo + "</h1><p>Sistema de Moeda Estudantil</p></div>"
                + "<div class=\"bd\">" + conteudo + "</div>"
                + "<div class=\"ft\">E-mail automático — não responda a esta mensagem.</div>"
                + "</div></body></html>";
    }

    private String templateProfessorEnvio(Professor professor, TransacaoEnvio transacao) {
        String corpo = "<div class=\"f\"><div class=\"lb\">Professor</div>"
                + "<div class=\"vl\">" + professor.getNome() + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Aluno beneficiado</div>"
                + "<div class=\"vl\">" + transacao.getAluno().getNome() + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Moedas enviadas</div>"
                + "<div class=\"vl\"><span class=\"badge\">+" + transacao.getQuantidade() + " moedas</span></div></div>"
                + "<div class=\"f\"><div class=\"lb\">Motivo</div>"
                + "<div class=\"vl\">" + transacao.getMotivo() + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Saldo restante</div>"
                + "<div class=\"vl\">" + professor.getSaldoMoedas() + " moedas</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Data</div>"
                + "<div class=\"vl\">" + transacao.getDataHora().toLocalDate() + "</div></div>";
        return baseHtml("Moedas enviadas com sucesso!", "#7c3aed", corpo);
    }

    private String templateAlunoRecebimento(Aluno aluno, TransacaoEnvio transacao) {
        String corpo = "<p style=\"font-size:15px;color:#333;margin-bottom:20px\">"
                + "Parabéns, <strong>" + aluno.getNome() + "</strong>! Você recebeu um reconhecimento acadêmico.</p>"
                + "<div class=\"f\"><div class=\"lb\">Moedas recebidas</div>"
                + "<div class=\"vl\"><span class=\"badge\">+" + transacao.getQuantidade() + " moedas</span></div></div>"
                + "<div class=\"f\"><div class=\"lb\">Professor</div>"
                + "<div class=\"vl\">" + transacao.getProfessor().getNome() + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Motivo</div>"
                + "<div class=\"vl\">" + transacao.getMotivo() + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Seu saldo atual</div>"
                + "<div class=\"vl\">" + aluno.getSaldoMoedas() + " moedas</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Data</div>"
                + "<div class=\"vl\">" + transacao.getDataHora().toLocalDate() + "</div></div>"
                + "<p class=\"hint\">Acesse a plataforma para resgatar vantagens com suas moedas.</p>";
        return baseHtml("Você recebeu moedas!", "#7c3aed", corpo);
    }

    private String templateCupomAluno(Aluno aluno, Cupom cupom) {
        String vantagem = cupom.getTransacaoResgate().getVantagem().getNome();
        String empresa = cupom.getTransacaoResgate().getVantagem().getEmpresaParceira().getNome();
        String corpo = "<p style=\"font-size:15px;color:#333;margin-bottom:20px\">"
                + "Olá, <strong>" + aluno.getNome() + "</strong>! Seu cupom foi gerado com sucesso.</p>"
                + "<div class=\"f\"><div class=\"lb\">Vantagem</div>"
                + "<div class=\"vl\">" + vantagem + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Empresa</div>"
                + "<div class=\"vl\">" + empresa + "</div></div>"
                + "<div class=\"code-box\"><div class=\"lb\" style=\"margin-bottom:8px\">Código do Cupom</div>"
                + "<div class=\"code\">" + cupom.getCodigoUnico() + "</div></div>"
                + "<div class=\"qr-box\"><p style=\"font-size:12px;color:#888;margin-bottom:8px\">Apresente o QR Code na empresa</p>"
                + "<img src=\"cid:qrcode\" width=\"160\" height=\"160\" alt=\"QR Code " + cupom.getCodigoUnico() + "\"/></div>"
                + "<p class=\"warn\">⚠️ Cupom intransferível e de uso único.</p>";
        return baseHtml("Seu cupom de resgate", "#6d28d9", corpo);
    }

    private String templateCupomEmpresa(EmpresaParceira empresa, Cupom cupom) {
        String nomeAluno = cupom.getTransacaoResgate().getAluno().getNome();
        String vantagem = cupom.getTransacaoResgate().getVantagem().getNome();
        String corpo = "<p style=\"font-size:15px;color:#333;margin-bottom:20px\">"
                + "Uma nova vantagem foi resgatada por um aluno.</p>"
                + "<div class=\"f\"><div class=\"lb\">Aluno</div>"
                + "<div class=\"vl\">" + nomeAluno + "</div></div>"
                + "<div class=\"f\"><div class=\"lb\">Vantagem resgatada</div>"
                + "<div class=\"vl\">" + vantagem + "</div></div>"
                + "<div class=\"code-box\"><div class=\"lb\" style=\"margin-bottom:8px\">Código para Validação</div>"
                + "<div class=\"code\">" + cupom.getCodigoUnico() + "</div></div>"
                + "<div class=\"qr-box\"><p style=\"font-size:12px;color:#888;margin-bottom:8px\">QR Code do cupom</p>"
                + "<img src=\"cid:qrcode\" width=\"160\" height=\"160\" alt=\"QR Code " + cupom.getCodigoUnico() + "\"/></div>"
                + "<p class=\"hint\">Acesse a plataforma para confirmar o uso deste cupom.</p>";
        return baseHtml("Novo resgate de cupom", "#4338ca", corpo);
    }
}
