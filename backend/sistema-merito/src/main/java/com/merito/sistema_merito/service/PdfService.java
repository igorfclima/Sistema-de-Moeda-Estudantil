package com.merito.sistema_merito.service;

import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.domain.entity.Professor;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PdfService {

    private static final Logger log = LoggerFactory.getLogger(PdfService.class);

    public static class ProfessorParseResult {
        public String nome;
        public String cpf;
        public String email;
        public String departamento;
        public String loginDesejado;
        public String senhaDesejada;
    }

    public static class InstituicaoParseResult {
        public String nome;
        public String cnpj;
        public List<ProfessorParseResult> professores = new ArrayList<>();
    }

    /**
     * Extrai texto do PDF e tenta detectar informações da instituição e professores.
     * Formato esperado (flexível): linhas contendo "INSTITUICAO:" e linhas iniciando com "PROFESSOR:"
     */
    public InstituicaoParseResult parseInstitutionPdf(byte[] pdfBytes) {
        InstituicaoParseResult result = new InstituicaoParseResult();
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            org.apache.pdfbox.text.PDFTextStripper stripper = new org.apache.pdfbox.text.PDFTextStripper();
            String text = stripper.getText(doc);
            String[] lines = text.split("\\r?\\n");
            for (String raw : lines) {
                String line = raw.trim();
                if (line.toUpperCase().startsWith("INSTITUICAO:")) {
                    result.nome = line.substring(line.indexOf(":") + 1).trim();
                } else if (line.toUpperCase().startsWith("CNPJ:")) {
                    result.cnpj = line.substring(line.indexOf(":") + 1).trim();
                } else if (line.toUpperCase().startsWith("PROFESSOR:")) {
                    // Expected: PROFESSOR: Nome | CPF | email | departamento | loginDesejado | senhaDesejada
                    String payload = line.substring(line.indexOf(":") + 1).trim();
                    String[] parts = payload.split("\\|");
                    ProfessorParseResult p = new ProfessorParseResult();
                    if (parts.length > 0) p.nome = parts[0].trim();
                    if (parts.length > 1) p.cpf = parts[1].trim();
                    if (parts.length > 2) p.email = parts[2].trim();
                    if (parts.length > 3) p.departamento = parts[3].trim();
                    if (parts.length > 4) p.loginDesejado = parts[4].trim();
                    if (parts.length > 5) p.senhaDesejada = parts[5].trim();
                    result.professores.add(p);
                }
            }
        } catch (IOException e) {
            log.error("Erro ao ler PDF: {}", e.getMessage(), e);
        }
        return result;
    }

    /**
     * Gera um PDF simples com as credenciais criadas para a instituição.
     */
    public byte[] generateConfirmationPdf(Instituicao instituicao, List<Professor> professores, List<String> senhas) {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.LETTER);
            doc.addPage(page);
            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
                cs.newLineAtOffset(50, 700);
                cs.showText("Confirmação de cadastro - " + (instituicao.getNome() == null ? "Instituição" : instituicao.getNome()));
                cs.endText();

                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA, 11);
                cs.newLineAtOffset(50, 680);
                cs.showText("CNPJ: " + (instituicao.getCnpj() == null ? "-" : instituicao.getCnpj()));
                cs.endText();

                float y = 650;
                for (int i = 0; i < professores.size(); i++) {
                    Professor p = professores.get(i);
                    String senha = (i < senhas.size() ? senhas.get(i) : "");
                    cs.beginText();
                    cs.setFont(PDType1Font.HELVETICA, 10);
                    cs.newLineAtOffset(50, y);
                    String line = String.format("Professor: %s | CPF: %s | Email: %s | Login: %s | Senha: %s",
                            p.getNome(), p.getCpf(), p.getEmail(), p.getEmail() == null ? "-" : p.getEmail(), senha);
                    cs.showText(truncate(line, 100));
                    cs.endText();
                    y -= 16;
                    if (y < 80) break;
                }
            }
            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                doc.save(out);
                return out.toByteArray();
            }
        } catch (IOException e) {
            log.error("Erro ao gerar PDF de confirmação: {}", e.getMessage(), e);
            return "".getBytes(StandardCharsets.UTF_8);
        }
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max - 3) + "...";
    }
}
