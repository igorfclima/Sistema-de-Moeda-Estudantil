package com.merito.sistema_merito.config;

import com.merito.sistema_merito.domain.entity.Instituicao;
import com.merito.sistema_merito.domain.entity.Professor;
import com.merito.sistema_merito.repository.InstituicaoRepository;
import com.merito.sistema_merito.repository.ProfessorRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(InstituicaoRepository instituicaoRepository,
                      ProfessorRepository professorRepository,
                      PasswordEncoder passwordEncoder) {
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
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
        if (professorRepository.existsByCpf(cpf)) {
            return;
        }

        Professor professor = new Professor();
        professor.setNome(nome);
        professor.setCpf(cpf);
        professor.setEmail(email);
        professor.setSenhaHash(passwordEncoder.encode("Senha@123"));
        professor.setDepartamento(departamento);
        professor.setSaldoMoedas(0);
        professor.setInstituicao(instituicao);
        professorRepository.save(professor);
    }
}