"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Icon({ name, className }: { name: string; className?: string }) {
    const base = "inline-block align-middle " + (className ?? "");
    switch (name) {
        case "user":
            return (
                <svg className={base} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 20c0-3.3137 4.0294-6 8-6s8 2.6863 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "email":
            return (
                <svg className={base} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 8.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "lock":
            return (
                <svg className={base} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "id":
            return (
                <svg className={base} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 11h.01M12 11h3M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "building":
            return (
                <svg className={base} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 21V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 10h.01M13 10h.01M9 14h.01M13 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return null;
    }
}

type Profile = "ALUNO" | "EMPRESA";
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

const profiles: Array<{ key: Profile; label: string }> = [
    { key: "ALUNO", label: "Aluno" },
    { key: "EMPRESA", label: "Empresa" },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function AuthPage() {
    const router = useRouter();
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
                if (!response.ok) return;
                const data = (await response.json()) as Instituicao[];
                if (ativo) {
                    setInstituicoes(data);
                    setInstituicaoId((current) => current || data[0]?.id || "");
                }
            } catch {
                if (ativo) setInstituicoes([]);
            }
        }
        carregarInstituicoes();
        return () => { ativo = false; };
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch(
                mode === "login"
                    ? `${apiUrl}/api/auth/login`
                    : `${apiUrl}/api/${selectedProfile === "EMPRESA" ? "empresas" : "alunos"}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body:
                        mode === "login"
                            ? JSON.stringify({ email, senha })
                            : JSON.stringify(
                                  selectedProfile === "ALUNO"
                                      ? { email, senhaHash: senha, nome, cpf, rg, endereco, curso, instituicaoId }
                                      : { email, senhaHash: senha, nomeEmpresa: nome, cnpj, descricao },
                              ),
                },
            );

            const payload = (await response.json()) as LoginResponse & {
                message?: string;
                nomeEmpresa?: string;
            };

            if (!response.ok) {
                throw new Error(payload.message ?? "Não foi possível concluir a operação.");
            }

            if (mode === "login") {
                localStorage.setItem("sme.token", payload.token);
                localStorage.setItem("sme.user", JSON.stringify({
                    id: payload.usuarioId,
                    nome: payload.nome,
                    email: payload.email,
                    tipoUsuario: payload.tipoUsuario,
                }));

                setStatus(`Bem-vindo, ${payload.nome}. Redirecionando...`);

                const roleMap: { [key: string]: string } = {
                    ROLE_ALUNO: "/dashboard/aluno",
                    ROLE_PROFESSOR: "/dashboard/professor",
                    ROLE_EMPRESA: "/dashboard/empresa",
                    ROLE_ADMIN: "/dashboard/admin",
                };

                setTimeout(() => {
                    router.push(roleMap[payload.tipoUsuario] || "/dashboard/aluno");
                }, 500);
                return;
            }

            setStatus(`Cadastro realizado com sucesso! Você já pode entrar.`);
            setMode("login");
            setSenha("");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen w-full bg-linear-to-br from-[#f5f3ff] to-[#faf9ff] flex flex-col">
            {/* Top bar */}
            <div className="px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-xs font-bold text-white">
                        ★
                    </div>
                    <span className="text-sm font-semibold text-gray-800">SME</span>
                </Link>
                <Link href="/" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    ← Voltar ao início
                </Link>
            </div>

            <section className="flex flex-1 items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {mode === "login" ? "Entrar no sistema" : "Criar conta"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            {mode === "login"
                                ? "Acesse sua conta para continuar"
                                : "Preencha os dados para se cadastrar"}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
                        {mode === "cadastro" && (
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {profiles.map((profile) => (
                                    <button
                                        key={profile.key}
                                        type="button"
                                        onClick={() => setSelectedProfile(profile.key)}
                                        className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition border ${
                                            selectedProfile === profile.key
                                                ? "bg-purple-50 border-purple-300 text-purple-700"
                                                : "bg-white border-gray-200 text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        <Icon name={profile.key === "ALUNO" ? "user" : "building"} />
                                        {profile.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === "cadastro" && (
                                <label className="block space-y-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        {selectedProfile === "EMPRESA" ? "Nome da empresa" : "Nome completo"}
                                    </span>
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        placeholder={selectedProfile === "EMPRESA" ? "Nome da empresa" : "Seu nome completo"}
                                        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                    />
                                </label>
                            )}

                            <label className="block space-y-1">
                                <span className="text-sm font-medium text-gray-700">Email</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><Icon name="email" /></span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="voce@exemplo.com"
                                        className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                        autoComplete="email"
                                    />
                                </div>
                            </label>

                            <label className="block space-y-1">
                                <span className="text-sm font-medium text-gray-700">Senha</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><Icon name="lock" /></span>
                                    <input
                                        type="password"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                        placeholder="Digite sua senha"
                                        className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </label>

                            {mode === "cadastro" && selectedProfile === "ALUNO" && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="block space-y-1">
                                            <span className="text-sm font-medium text-gray-700">CPF</span>
                                            <input value={cpf} onChange={(e) => setCpf(e.target.value)} required type="text" placeholder="000.000.000-00" className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                                        </label>
                                        <label className="block space-y-1">
                                            <span className="text-sm font-medium text-gray-700">RG</span>
                                            <input value={rg} onChange={(e) => setRg(e.target.value)} required type="text" placeholder="00.000.000-0" className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                                        </label>
                                    </div>
                                    <label className="block space-y-1">
                                        <span className="text-sm font-medium text-gray-700">Endereço</span>
                                        <input value={endereco} onChange={(e) => setEndereco(e.target.value)} type="text" placeholder="Rua, número, bairro" className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="block space-y-1">
                                            <span className="text-sm font-medium text-gray-700">Instituição</span>
                                            <select value={instituicaoId} onChange={(e) => setInstituicaoId(e.target.value)} required className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                                                {instituicoes.length === 0 ? (
                                                    <option value="">Carregando...</option>
                                                ) : (
                                                    instituicoes.map((i) => (
                                                        <option key={i.id} value={i.id}>{i.nome}</option>
                                                    ))
                                                )}
                                            </select>
                                        </label>
                                        <label className="block space-y-1">
                                            <span className="text-sm font-medium text-gray-700">Curso</span>
                                            <input value={curso} onChange={(e) => setCurso(e.target.value)} required type="text" placeholder="Ex.: Sistemas de Informação" className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                                        </label>
                                    </div>
                                </>
                            )}

                            {mode === "cadastro" && selectedProfile === "EMPRESA" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="block space-y-1">
                                        <span className="text-sm font-medium text-gray-700">CNPJ</span>
                                        <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required type="text" placeholder="00.000.000/0000-00" className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                                    </label>
                                    <label className="block space-y-1">
                                        <span className="text-sm font-medium text-gray-700">Descrição</span>
                                        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} type="text" placeholder="O que sua empresa faz" className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                                    </label>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-11 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-sm font-semibold text-white shadow-lg transition hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? mode === "login" ? "Entrando..." : "Cadastrando..."
                                    : mode === "login" ? "Entrar" : "Criar conta"}
                            </button>

                            {status && (
                                <div className={`rounded-xl border px-4 py-3 text-sm ${status.includes("sucesso") || status.includes("Bem-vindo") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                                    {status}
                                </div>
                            )}
                        </form>

                        <div className="mt-5 text-center text-sm text-gray-500">
                            {mode === "login" ? (
                                <>
                                    Não tem conta?{" "}
                                    <button type="button" onClick={() => setMode("cadastro")} className="font-semibold text-purple-600 hover:text-purple-800">
                                        Criar conta
                                    </button>
                                </>
                            ) : (
                                <>
                                    Já tem conta?{" "}
                                    <button type="button" onClick={() => setMode("login")} className="font-semibold text-purple-600 hover:text-purple-800">
                                        Entrar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
