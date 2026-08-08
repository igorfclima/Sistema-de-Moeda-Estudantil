package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.domain.entity.Administrador;
import com.merito.sistema_merito.repository.InstituicaoRepository;
import com.merito.sistema_merito.repository.ProfessorRepository;
import com.merito.sistema_merito.repository.AdministradorRepository;
import com.merito.sistema_merito.service.PdfService;
import com.merito.sistema_merito.service.ServicoEmail;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/instituicoes")
public class AdminController {
    // Este controller tem muitas responsabilidades. Considere extrair a lógica de
    // import de PDF e envio de emails para services especializados.

    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;
    private final PdfService pdfService;
    private final ServicoEmail servicoEmail;

    public AdminController(InstituicaoRepository instituicaoRepository,
                           ProfessorRepository professorRepository,
                           AdministradorRepository administradorRepository,
                           PasswordEncoder passwordEncoder,
                           PdfService pdfService,
                           ServicoEmail servicoEmail) {
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
        this.pdfService = pdfService;
        this.servicoEmail = servicoEmail;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @Transactional
    public ResponseEntity<?> criarInstituicao(@RequestParam("nome") String nome,
                                              @RequestParam("cnpj") String cnpj,
                                              @RequestParam(value = "file", required = false) MultipartFile file) throws Exception {
        if (instituicaoRepository.existsByCnpj(cnpj)) {
            return ResponseEntity.badRequest().body("Instituição com este CNPJ já existe");
        }

        Instituicao instituicao = new Instituicao();
        instituicao.setNome(nome);
        instituicao.setCnpj(cnpj);
        instituicaoRepository.save(instituicao);

        List<Professor> created = new ArrayList<>();
        List<String> senhas = new ArrayList<>();

        if (file != null && !file.isEmpty()) {
            byte[] bytes = file.getBytes();
            PdfService.InstituicaoParseResult parsed = pdfService.parseInstitutionPdf(bytes);
            for (PdfService.ProfessorParseResult p : parsed.professores) {
                if (p.cpf == null || p.cpf.isBlank()) continue;
                if (professorRepository.existsByCpf(p.cpf)) continue;
                Professor prof = new Professor();
                prof.setNome(p.nome != null ? p.nome : "");
                prof.setCpf(p.cpf);
                prof.setEmail(p.email != null ? p.email : (p.loginDesejado != null ? p.loginDesejado : null));
                prof.setDepartamento(p.departamento != null ? p.departamento : "");
                String senha = p.senhaDesejada != null && !p.senhaDesejada.isBlank() ? p.senhaDesejada : UUID.randomUUID().toString().substring(0, 8);
                prof.setSenhaHash(passwordEncoder.encode(senha));
                prof.setSaldoMoedas(1000);
                prof.setInstituicao(instituicao);
                professorRepository.save(prof);
                created.add(prof);
                senhas.add(senha);
            }

            // generate confirmation PDF and send to admin email
            byte[] pdfConfirm = pdfService.generateConfirmationPdf(instituicao, created, senhas);
            //O email do admin está hardcoded. Isso deveria vir de uma propriedade
        // de configuração (application.properties) para ser flexível por ambiente.
        String adminEmail = "admin@sistemamerito.com";
            servicoEmail.enviarPdfAnexo(adminEmail, "Confirmação de cadastro de instituição: " + instituicao.getNome(), "Segue em anexo o PDF com os professores cadastrados.", pdfConfirm, instituicao.getNome() + "-professores.pdf", null);
        }

        return ResponseEntity.ok(instituicao);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> listarInstituicoes() {
        return ResponseEntity.ok(instituicaoRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(path = "/{id}")
    public ResponseEntity<?> editarInstituicao(@PathVariable("id") UUID id,
                                               @RequestParam("nome") String nome,
                                               @RequestParam("cnpj") String cnpj) {
        return instituicaoRepository.findById(id).map(inst -> {
            inst.setNome(nome);
            inst.setCnpj(cnpj);
            instituicaoRepository.save(inst);
            return ResponseEntity.ok(inst);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?> deletarInstituicao(@PathVariable("id") UUID id) {
        return instituicaoRepository.findById(id).map(inst -> {
            instituicaoRepository.delete(inst);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
