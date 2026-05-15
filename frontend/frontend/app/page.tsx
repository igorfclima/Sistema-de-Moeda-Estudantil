import Link from "next/link";

const features = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Crédito semestral automático",
        desc: "Professores recebem 1.000 moedas a cada semestre letivo, com saldo acumulativo entre períodos.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Reconhecimento de mérito",
        desc: "Professores enviam moedas com mensagem de reconhecimento, valorizando o desempenho dos alunos.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 15h2M14 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Resgate de vantagens",
        desc: "Alunos trocam moedas acumuladas por produtos e descontos oferecidos pelas empresas parceiras.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 8.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Notificações por e-mail",
        desc: "Alertas automáticos ao receber moedas e códigos de cupom enviados diretamente ao aluno e empresa.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Cupons únicos e seguros",
        desc: "Cada resgate gera um código único e intransferível para validação pela empresa parceira.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Segurança e controle",
        desc: "Autenticação JWT, controle de papéis e validação de saldo em todas as operações do sistema.",
    },
];

const steps = [
    {
        num: "1",
        role: "Professor",
        color: "from-purple-600 to-purple-700",
        action: "Recebe 1.000 moedas semestrais e envia para alunos que se destacam com uma mensagem de reconhecimento.",
    },
    {
        num: "2",
        role: "Aluno",
        color: "from-violet-600 to-purple-600",
        action: "Acumula moedas recebidas e as troca por vantagens exclusivas oferecidas pelas empresas parceiras.",
    },
    {
        num: "3",
        role: "Empresa",
        color: "from-purple-700 to-indigo-700",
        action: "Cadastra vantagens com foto e preço em moedas. Recebe notificação a cada resgate e valida os cupons.",
    },
];

const actors = [
    {
        title: "Aluno",
        desc: "Receba moedas por mérito, acompanhe seu extrato e resgate vantagens exclusivas de empresas parceiras.",
        href: "/auth",
        cta: "Criar conta de aluno",
        bg: "from-purple-600 to-purple-800",
    },
    {
        title: "Empresa Parceira",
        desc: "Cadastre vantagens com foto e descrição, acompanhe os resgates e valorize o mérito estudantil.",
        href: "/auth",
        cta: "Cadastrar empresa",
        bg: "from-violet-600 to-purple-700",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Nav */}
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-sm font-bold text-white shadow-md">
                            ★
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">SME</p>
                            <p className="text-[10px] text-gray-500 leading-none mt-0.5">Sistema de Mérito Estudantil</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth"
                            className="text-sm font-medium text-gray-600 hover:text-purple-700 transition"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/auth"
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-sm font-semibold text-white shadow-md hover:-translate-y-px transition"
                        >
                            Criar conta
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden bg-[linear-gradient(160deg,#faf5ff_0%,#ede9fe_40%,#ddd6fe_100%)] py-20 sm:py-28 lg:py-36">
                {/* decorative circles */}
                <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-purple-300/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-violet-400/15 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-700 shadow-sm mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                        Plataforma de reconhecimento acadêmico
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                        Valorize o{" "}
                        <span className="bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] bg-clip-text text-transparent">
                            mérito estudantil
                        </span>
                        <br className="hidden sm:block" />
                        {" "}com moedas virtuais
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Professores reconhecem alunos com moedas. Alunos trocam por vantagens reais de empresas parceiras.
                        Um ecossistema simples que transforma desempenho em recompensa.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-white font-semibold text-base shadow-[0_12px_32px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 transition"
                        >
                            Começar agora
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <a
                            href="#como-funciona"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-purple-200 text-purple-700 font-semibold text-base hover:bg-purple-50 transition"
                        >
                            Como funciona
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
                        {[
                            { value: "1.000", label: "moedas por semestre" },
                            { value: "100%", label: "automático" },
                            { value: "4", label: "perfis de acesso" },
                            { value: "JWT", label: "autenticação segura" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-extrabold text-purple-700">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 sm:py-28 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">Funcionalidades</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Tudo que você precisa em um só lugar
                        </h2>
                        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                            Uma plataforma completa para reconhecimento, distribuição de moedas e resgate de vantagens.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition"
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Como funciona */}
            <section id="como-funciona" className="py-20 sm:py-28 bg-[linear-gradient(160deg,#faf5ff,#ede9fe)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">Como funciona</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Simples para todos os envolvidos
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((s) => (
                            <div
                                key={s.role}
                                className={`relative rounded-3xl bg-[linear-gradient(135deg,${s.color})] p-8 text-white shadow-lg`}
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-extrabold">
                                    {s.num}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{s.role}</h3>
                                <p className="text-purple-100 text-sm leading-relaxed">{s.action}</p>
                            </div>
                        ))}
                    </div>

                    {/* Flow diagram */}
                    <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
                        {["Professor envia moedas", "→", "Aluno acumula saldo", "→", "Aluno resgata vantagem", "→", "Empresa recebe notificação", "→", "Cupom único gerado"].map((item, i) => (
                            item === "→" ? (
                                <span key={i} className="text-purple-400 font-bold text-lg">→</span>
                            ) : (
                                <span key={i} className="rounded-xl border border-purple-200 bg-white px-4 py-2 font-medium text-purple-700 shadow-sm">
                                    {item}
                                </span>
                            )
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA por ator */}
            <section className="py-20 sm:py-28 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">Acesso</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Entre conforme seu perfil
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {actors.map((a) => (
                            <div
                                key={a.title}
                                className={`rounded-3xl bg-[linear-gradient(135deg,${a.bg})] p-8 text-white shadow-xl flex flex-col`}
                            >
                                <h3 className="text-2xl font-extrabold mb-3">{a.title}</h3>
                                <p className="text-purple-100 text-sm leading-relaxed flex-1">{a.desc}</p>
                                <Link
                                    href={a.href}
                                    className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-purple-700 font-semibold text-sm hover:bg-purple-50 transition"
                                >
                                    {a.cta}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-8">
                        Professores e administradores são cadastrados diretamente pela instituição.
                    </p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-[linear-gradient(135deg,#7c3aed,#6d28d9)]">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                        Pronto para começar?
                    </h2>
                    <p className="text-purple-200 mb-8 text-base">
                        Crie sua conta agora e faça parte do ecossistema de mérito estudantil.
                    </p>
                    <Link
                        href="/auth"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-purple-700 font-bold text-base hover:bg-purple-50 transition shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                    >
                        Acessar o sistema
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                            ★
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">SME</p>
                            <p className="text-xs text-gray-500">Sistema de Mérito Estudantil</p>
                        </div>
                    </div>
                    <p className="text-xs">
                        Desenvolvido com Next.js · Spring Boot · PostgreSQL
                    </p>
                    <Link href="/auth" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition">
                        Acessar sistema →
                    </Link>
                </div>
            </footer>
        </div>
    );
}
