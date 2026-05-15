package com.merito.sistema_merito.config;

import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.domain.entity.Administrador;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.domain.entity.Aluno;
import com.merito.sistema_merito.domain.entity.EmpresaParceira;
import com.merito.sistema_merito.repository.InstituicaoRepository;
import com.merito.sistema_merito.repository.ProfessorRepository;
import com.merito.sistema_merito.repository.AlunoRepository;
import com.merito.sistema_merito.repository.EmpresaParceiraRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

        private final InstituicaoRepository instituicaoRepository;
        private final ProfessorRepository professorRepository;
        private final AlunoRepository alunoRepository;
        private final EmpresaParceiraRepository empresaParceiraRepository;
        private final PasswordEncoder passwordEncoder;
        private final com.merito.sistema_merito.repository.AdministradorRepository administradorRepository;

        public DataSeeder(InstituicaoRepository instituicaoRepository,
                                          ProfessorRepository professorRepository,
                                          AlunoRepository alunoRepository,
                                          EmpresaParceiraRepository empresaParceiraRepository,
                                          PasswordEncoder passwordEncoder,
                                          com.merito.sistema_merito.repository.AdministradorRepository administradorRepository) {
                this.instituicaoRepository = instituicaoRepository;
                this.professorRepository = professorRepository;
                this.alunoRepository = alunoRepository;
                this.empresaParceiraRepository = empresaParceiraRepository;
                this.passwordEncoder = passwordEncoder;
                this.administradorRepository = administradorRepository;
        }

    @Override
    public void run(ApplicationArguments args) {
        Instituicao institutoVale = garantirInstituicao(
                "Instituto Federal do Vale",
                "11.111.111/0001-11"
        );
        Instituicao horizonte = garantirInstituicao(
                "Centro Educacional Horizonte",
                "22.222.222/0001-22"
        );
        Instituicao aurora = garantirInstituicao(
                "Escola Técnica Aurora",
                "33.333.333/0001-33"
        );
        Instituicao integra = garantirInstituicao(
                "Faculdade Integra",
                "44.444.444/0001-44"
        );

        garantirProfessor(
                "Paulo Almeida",
                "111.111.111-11",
                "paulo.almeida@ifvale.edu.br",
                "Coordenação",
                institutoVale
        );
        garantirProfessor(
                "Marina Costa",
                "222.222.222-22",
                "marina.costa@horizonte.edu.br",
                "Matemática",
                horizonte
        );
        garantirProfessor(
                "Renato Souza",
                "333.333.333-33",
                "renato.souza@aurora.edu.br",
                "Informática",
                aurora
        );
        garantirProfessor(
                "Carla Mendes",
                "444.444.444-44",
                "carla.mendes@integra.edu.br",
                "Administração",
                integra
        );
        garantirProfessor(
                "Bruno Lima",
                "555.555.555-55",
                "bruno.lima@ifvale.edu.br",
                "Engenharia",
                institutoVale
        );
        garantirProfessor(
                "Aline Fernandes",
                "666.666.666-66",
                "aline.fernandes@horizonte.edu.br",
                "Pedagogia",
                horizonte
        );

                garantirAdministrador();

                // Criar alunos de teste
                garantirAluno(
                        "João Silva",
                        "777.777.777-77",
                        "12.345.678-90",
                        "Rua Principal, 100",
                        "Engenharia de Software",
                        institutoVale
                );
                garantirAluno(
                        "Maria Santos",
                        "888.888.888-88",
                        "98.765.432-10",
                        "Avenida Central, 200",
                        "Administração",
                        horizonte
                );
                garantirAluno(
                        "Pedro Oliveira",
                        "999.999.999-99",
                        "55.555.555-55",
                        "Rua Lateral, 300",
                        "Informática",
                        aurora
                );

                // Criar empresas parceiras de teste
                garantirEmpresaParceira(
                        "Tech Solutions Brasil",
                        "12.345.678/0001-00",
                        "Empresa de tecnologia e soluções em software",
                        "contato@techsolutions.com.br"
                );
                garantirEmpresaParceira(
                        "Consultoria e Negócios Ltda",
                        "98.765.432/0001-11",
                        "Consultoria empresarial e gestão estratégica",
                        "contato@consultorianegocios.com.br"
                );
                garantirEmpresaParceira(
                        "Inovação Digital S/A",
                        "55.555.555/0001-22",
                        "Desenvolvimento de sistemas e aplicações",
                        "contato@inovacaodigital.com.br"
                );
    }

        private void garantirAdministrador() {
                // If there's already any administrador, skip creating default
                if (!administradorRepository.findAll().isEmpty()) return;

                Administrador admin = new Administrador();
                admin.setEmail("admin@sistemamerito.com");
                admin.setSenhaHash(passwordEncoder.encode("Admin@123"));
                admin.setNome("Administrador SME");
                administradorRepository.save(admin);
        }

        private Instituicao garantirInstituicao(String nome, String cnpj) {
        return instituicaoRepository.findByCnpj(cnpj).orElseGet(() -> {
            Instituicao instituicao = new Instituicao();
            instituicao.setNome(nome);
            instituicao.setCnpj(cnpj);
            instituicao.setAtiva(Boolean.TRUE);
            return instituicaoRepository.save(instituicao);
        });
    }

    private void garantirProfessor(String nome, String cpf, String email, String departamento, Instituicao instituicao) {
        professorRepository.findByCpf(cpf).ifPresentOrElse(existente -> {
            if (existente.getSaldoMoedas() == 0) {
                existente.setSaldoMoedas(1000);
                professorRepository.save(existente);
            }
        }, () -> {
            Professor professor = new Professor();
            professor.setNome(nome);
            professor.setCpf(cpf);
            professor.setEmail(email);
            professor.setSenhaHash(passwordEncoder.encode("Senha@123"));
            professor.setDepartamento(departamento);
            professor.setSaldoMoedas(1000);
            professor.setInstituicao(instituicao);
            professorRepository.save(professor);
        });
    }

    private void garantirAluno(String nome, String cpf, String rg, String endereco, String curso, Instituicao instituicao) {
        if (alunoRepository.existsByCpf(cpf)) {
            return;
        }

        Aluno aluno = new Aluno();
        aluno.setNome(nome);
        aluno.setCpf(cpf);
        aluno.setRg(rg);
        aluno.setEndereco(endereco);
        aluno.setCurso(curso);
        aluno.setEmail(cpf.replaceAll("[^0-9]", "") + "@sistemamerito.com");
        aluno.setSenhaHash(passwordEncoder.encode("Senha@123"));
        aluno.setSaldoMoedas(50);
        aluno.setInstituicao(instituicao);
        alunoRepository.save(aluno);
    }

    private void garantirEmpresaParceira(String nomeEmpresa, String cnpj, String descricao, String email) {
        if (empresaParceiraRepository.findByCnpj(cnpj).isPresent()) {
            return;
        }

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNomeEmpresa(nomeEmpresa);
        empresa.setCnpj(cnpj);
        empresa.setDescricao(descricao);
        empresa.setEmail(email);
        empresa.setSenhaHash(passwordEncoder.encode("Senha@123"));
        empresaParceiraRepository.save(empresa);
    }
}
