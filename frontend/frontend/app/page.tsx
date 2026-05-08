"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

function Icon({ name, className }: { name: string; className?: string }) {
    const base = "inline-block align-middle " + (className ?? "");
    switch (name) {
        case "user":
            return (
                <svg
                    className={base}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <path
                        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M4 20c0-3.3137 4.0294-6 8-6s8 2.6863 8 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "email":
            return (
                <svg
                    className={base}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <path
                        d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21 8.5l-9 6-9-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "lock":
            return (
                <svg
                    className={base}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <rect
                        x="3"
                        y="11"
                        width="18"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 11V8a5 5 0 0 1 10 0v3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "id":
            return (
                <svg
                    className={base}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="16"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 11h.01M12 11h3M8 15h4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "building":
            return (
                <svg
                    className={base}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <path
                        d="M3 21h18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6 21V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 10h.01M13 10h.01M9 14h.01M13 14h.01"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        default:
            return null;
    }
}

type Profile = "ALUNO" | "PROFESSOR" | "EMPRESA";
type Mode = "login" | "cadastro";

type LoginResponse = {
    token: string;
    tipoUsuario: string;
    usuarioId: string;
    nome: string;
    email: string;
};

type Instituicao = {
    id: string;
    nome: string;
    cnpj: string;
    ativa: boolean;
};

const profiles: Array<{ key: Profile; label: string; hint: string }> = [
    { key: "ALUNO", label: "Aluno", hint: "Crie sua conta estudantil" },
    { key: "PROFESSOR", label: "Professor", hint: "Crie sua conta de docente" },
    { key: "EMPRESA", label: "Empresa", hint: "Crie sua conta parceira" },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function Home() {
    const [mode, setMode] = useState<Mode>("login");
    const [selectedProfile, setSelectedProfile] = useState<Profile>("ALUNO");
    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [endereco, setEndereco] = useState("");
    const [curso, setCurso] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [descricao, setDescricao] = useState("");
    const [instituicaoId, setInstituicaoId] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function carregarInstituicoes() {
            try {
                const response = await fetch(`${apiUrl}/api/instituicoes`);
                if (!response.ok) {
                    return;
                }

                const data = (await response.json()) as Instituicao[];
                if (ativo) {
                    setInstituicoes(data);
                    setInstituicaoId((current) => current || data[0]?.id || "");
                }
            } catch {
                if (ativo) {
                    setInstituicoes([]);
                }
            }
        }

        carregarInstituicoes();

        return () => {
            ativo = false;
        };
    }, []);

    const currentProfile = useMemo(
        () => profiles.find((profile) => profile.key === selectedProfile),
        [selectedProfile],
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch(
                mode === "login"
                    ? `${apiUrl}/api/auth/login`
                    : `${apiUrl}/api/${selectedProfile === "EMPRESA" ? "empresas" : selectedProfile === "PROFESSOR" ? "professores" : "alunos"}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:
                        mode === "login"
                            ? JSON.stringify({ email, senha })
                            : JSON.stringify(
                                  selectedProfile === "ALUNO"
                                      ? {
                                            email,
                                            senhaHash: senha,
                                            nome,
                                            cpf,
                                            rg,
                                            endereco,
                                            curso,
                                            instituicaoId,
                                        }
                                      : selectedProfile === "PROFESSOR"
                                        ? {
                                              email,
                                              senhaHash: senha,
                                              nome,
                                              cpf,
                                              departamento,
                                              instituicaoId,
                                          }
                                        : {
                                              email,
                                              senhaHash: senha,
                                              nomeEmpresa: nome,
                                              cnpj,
                                              descricao,
                                          },
                              ),
                },
            );

            const payload = (await response.json()) as LoginResponse & {
                message?: string;
                nomeEmpresa?: string;
                nome?: string;
            };

            if (!response.ok) {
                throw new Error(
                    payload.message ?? "Não foi possível concluir a operação.",
                );
            }

            if (mode === "login") {
                localStorage.setItem("sme.token", payload.token);
                localStorage.setItem(
                    "sme.user",
                    JSON.stringify({
                        id: payload.usuarioId,
                        nome: payload.nome,
                        email: payload.email,
                        tipoUsuario: payload.tipoUsuario,
                        perfilSelecionado: selectedProfile,
                    }),
                );

                setStatus(
                    `Bem-vindo, ${payload.nome}. Login concluído com ${payload.tipoUsuario}.`,
                );
                return;
            }

            const displayName = payload.nome ?? payload.nomeEmpresa ?? nome;
            setStatus(
                `Cadastro realizado com sucesso para ${displayName}. Você já pode entrar.`,
            );
            setMode("login");
            setSenha("");
        } catch (error) {
            setStatus(
                error instanceof Error
                    ? error.message
                    : "Erro inesperado ao concluir a operação.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 text-[var(--foreground)]">
            <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 sm:gap-8">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 sm:gap-3 sm:px-4 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                        ★
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-gray-600 sm:text-sm">
                            SME
                        </p>
                        <p className="text-[10px] text-gray-500 sm:text-[11px]">
                            Sistema de Mérito Estudantil
                        </p>
                    </div>
                </div>

                <div className="grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="hidden rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 shadow-sm lg:block">
                        <p className="mb-3 inline-flex rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                            Bem-vindo
                        </p>
                        <h1 className="max-w-xl text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                            Entre ou crie sua conta em poucos passos.
                        </h1>
                        <p className="mt-4 sm:mt-5 max-w-lg text-sm sm:text-base leading-7 text-[var(--muted)]">
                            Escolha o perfil certo, preencha os dados essenciais
                            e acesse o sistema com uma experiência simples e
                            clara.
                        </p>
                    </div>

                    <div className="w-full max-w-[28rem] mx-auto rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 shadow-lg">
                        <div className="grid grid-cols-3 gap-2">
                            {profiles.map((profile) => {
                                const active = selectedProfile === profile.key;
                                return (
                                    <button
                                        key={profile.key}
                                        type="button"
                                        onClick={() =>
                                            setSelectedProfile(profile.key)
                                        }
                                        className={`flex items-center gap-2 justify-center rounded-2xl px-3 py-2 text-sm font-medium transition border ${
                                            active
                                                ? "bg-white border-[rgba(124,58,237,0.18)] text-[var(--foreground)] shadow-[0_10px_30px_rgba(124,58,237,0.06)]"
                                                : "bg-white/90 border-gray-100 text-[var(--muted)] hover:text-[var(--foreground)]"
                                        }`}
                                        aria-pressed={active}
                                    >
                                        <span className="text-[14px] text-[var(--muted)]">
                                            {profile.key === "ALUNO" ? (
                                                <Icon name="user" />
                                            ) : profile.key === "PROFESSOR" ? (
                                                <Icon name="building" />
                                            ) : (
                                                <Icon name="email" />
                                            )}
                                        </span>
                                        <span>{profile.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-4"
                        >
                            {mode === "cadastro" ? (
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium text-[var(--foreground)]">
                                        {selectedProfile === "EMPRESA"
                                            ? "Nome da empresa"
                                            : "Nome completo"}
                                    </span>
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(event) =>
                                            setNome(event.target.value)
                                        }
                                        placeholder={
                                            selectedProfile === "EMPRESA"
                                                ? "Nome da empresa"
                                                : "Seu nome"
                                        }
                                        className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                    />
                                </label>
                            ) : null}

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-[var(--foreground)]">
                                    Email
                                </span>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-[var(--muted)]">
                                        <Icon name="email" />
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="voce@exemplo.com"
                                        className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                        autoComplete="email"
                                    />
                                </div>
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-[var(--foreground)]">
                                    Senha
                                </span>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-[var(--muted)]">
                                        <Icon name="lock" />
                                    </span>
                                    <input
                                        type="password"
                                        value={senha}
                                        onChange={(event) =>
                                            setSenha(event.target.value)
                                        }
                                        placeholder="Digite sua senha"
                                        className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </label>

                            {mode === "cadastro" &&
                            selectedProfile === "ALUNO" ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                CPF
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="id" />
                                                </span>
                                                <input
                                                    value={cpf}
                                                    onChange={(event) =>
                                                        setCpf(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="000.000.000-00"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                RG
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="id" />
                                                </span>
                                                <input
                                                    value={rg}
                                                    onChange={(event) =>
                                                        setRg(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="00.000.000-0"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-[var(--foreground)]">
                                            Endereço
                                        </span>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                <Icon name="building" />
                                            </span>
                                            <input
                                                value={endereco}
                                                onChange={(event) =>
                                                    setEndereco(
                                                        event.target.value,
                                                    )
                                                }
                                                type="text"
                                                placeholder="Rua, número, bairro"
                                                className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                            />
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                Instituição
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="building" />
                                                </span>
                                                <select
                                                    value={instituicaoId}
                                                    onChange={(event) =>
                                                        setInstituicaoId(
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="h-12 w-full appearance-none rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                >
                                                    {instituicoes.length ===
                                                    0 ? (
                                                        <option value="">
                                                            Carregando
                                                            instituições...
                                                        </option>
                                                    ) : (
                                                        instituicoes.map(
                                                            (instituicao) => (
                                                                <option
                                                                    key={
                                                                        instituicao.id
                                                                    }
                                                                    value={
                                                                        instituicao.id
                                                                    }
                                                                >
                                                                    {
                                                                        instituicao.nome
                                                                    }
                                                                </option>
                                                            ),
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </label>
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                Curso
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="building" />
                                                </span>
                                                <input
                                                    value={curso}
                                                    onChange={(event) =>
                                                        setCurso(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="Ex.: Sistemas de Informação"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </>
                            ) : null}

                            {mode === "cadastro" &&
                            selectedProfile === "PROFESSOR" ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                CPF
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="id" />
                                                </span>
                                                <input
                                                    value={cpf}
                                                    onChange={(event) =>
                                                        setCpf(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="000.000.000-00"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                Departamento
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="building" />
                                                </span>
                                                <input
                                                    value={departamento}
                                                    onChange={(event) =>
                                                        setDepartamento(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="Ex.: Engenharia"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-[var(--foreground)]">
                                            Instituição
                                        </span>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                <Icon name="building" />
                                            </span>
                                            <select
                                                value={instituicaoId}
                                                onChange={(event) =>
                                                    setInstituicaoId(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-12 w-full appearance-none rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                            >
                                                {instituicoes.length === 0 ? (
                                                    <option value="">
                                                        Carregando
                                                        instituições...
                                                    </option>
                                                ) : (
                                                    instituicoes.map(
                                                        (instituicao) => (
                                                            <option
                                                                key={
                                                                    instituicao.id
                                                                }
                                                                value={
                                                                    instituicao.id
                                                                }
                                                            >
                                                                {
                                                                    instituicao.nome
                                                                }
                                                            </option>
                                                        ),
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </label>
                                </>
                            ) : null}

                            {mode === "cadastro" &&
                            selectedProfile === "EMPRESA" ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                CNPJ
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="id" />
                                                </span>
                                                <input
                                                    value={cnpj}
                                                    onChange={(event) =>
                                                        setCnpj(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="00.000.000/0000-00"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                Descrição
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-[var(--muted)]">
                                                    <Icon name="building" />
                                                </span>
                                                <input
                                                    value={descricao}
                                                    onChange={(event) =>
                                                        setDescricao(
                                                            event.target.value,
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="O que sua empresa faz"
                                                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#9b93ae] focus:border-[rgba(124,58,237,0.35)] focus:ring-4 focus:ring-[rgba(124,58,237,0.12)]"
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_48px_rgba(124,58,237,0.32)] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading
                                    ? mode === "login"
                                        ? "Entrando..."
                                        : "Cadastrando..."
                                    : mode === "login"
                                      ? "Entrar"
                                      : "Criar conta"}
                            </button>

                            {status ? (
                                <div className="rounded-2xl border border-[rgba(124,58,237,0.16)] bg-white/80 px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
                                    {status}
                                </div>
                            ) : null}
                        </form>

                        <div className="mt-6 text-center text-sm text-[var(--muted)]">
                            {mode === "login" ? (
                                <button
                                    type="button"
                                    onClick={() => setMode("cadastro")}
                                    className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]"
                                >
                                    Criar conta
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setMode("login")}
                                    className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]"
                                >
                                    Já tenho conta
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-[var(--muted)]">
                    Sistema de acesso para alunos, professores e empresas.
                </p>
            </section>
        </main>
    );
}
