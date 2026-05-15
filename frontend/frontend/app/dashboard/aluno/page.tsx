"use client";

import { useEffect, useState } from "react";
import {
    MdAccountBalanceWallet,
    MdCardGiftcard,
    MdCheckCircle,
    MdClose,
    MdLocalOffer,
    MdRedeem,
    MdTrendingUp,
    MdWorkspacePremium,
} from "react-icons/md";
import { getUser } from "@/app/lib/api";
import { apiCall } from "@/app/lib/api";

type Vantagem = {
    id: string;
    nome: string;
    descricao: string;
    fotoUrl?: string;
    status: string;
    custoMoedas: number;
};

type Transaction = {
    id: string;
    tipo: string;
    moedas: number;
    data: string;
    descricao?: string;
};

type Resgate = {
    id: string;
    vantagemId: string;
    data: string;
    cupom: string;
    nomeVantagem?: string;
    custoMoedas?: number;
};

export default function AlunoDashboard() {
    const [user, setUser] = useState<any>(null);
    const [saldo, setSaldo] = useState(0);
    const [extrato, setExtrato] = useState<Transaction[]>([]);
    const [vantagens, setVantagens] = useState<Vantagem[]>([]);
    const [resgates, setResgates] = useState<Resgate[]>([]);
    const [activeTab, setActiveTab] = useState<
        "vantagens" | "extrato" | "cupons"
    >("vantagens");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resgatando, setResgatando] = useState<string | null>(null);
    const [cupomPopup, setCupomPopup] = useState<Resgate | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const currentUser = getUser();
                setUser(currentUser);

                if (!currentUser?.id) {
                    setError("Usuário não autenticado");
                    setLoading(false);
                    return;
                }

                const [saldoData, extratoData, vantagemsData, resgatesData] =
                    await Promise.all([
                        apiCall(`/api/alunos/${currentUser.id}/saldo`).catch(
                            () => 0,
                        ),
                        apiCall(`/api/alunos/${currentUser.id}/extrato`).catch(
                            () => [],
                        ),
                        apiCall(`/api/vantagens`).catch(() => []),
                        apiCall(`/api/alunos/${currentUser.id}/resgates`).catch(
                            () => [],
                        ),
                    ]);

                setSaldo(typeof saldoData === "number" ? saldoData : 0);
                setExtrato(Array.isArray(extratoData) ? extratoData : []);
                setVantagens(Array.isArray(vantagemsData) ? vantagemsData : []);
                setResgates(Array.isArray(resgatesData) ? resgatesData : []);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Erro ao carregar dados",
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    async function handleResgate(vantagemId: string) {
        setResgatando(vantagemId);
        try {
            const resultado = await apiCall(`/api/alunos/${user.id}/resgatar`, {
                method: "POST",
                body: JSON.stringify({ vantagemId }),
            }) as Resgate;

            const [saldoData, resgatesData] = await Promise.all([
                apiCall(`/api/alunos/${user.id}/saldo`).catch(() => 0),
                apiCall(`/api/alunos/${user.id}/resgates`).catch(() => []),
            ]);

            setSaldo(typeof saldoData === "number" ? saldoData : 0);
            setResgates(Array.isArray(resgatesData) ? resgatesData : []);
            setCupomPopup(resultado);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Erro ao resgatar vantagem",
            );
        } finally {
            setResgatando(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600 mx-auto mb-4 animate-spin"></div>
                    <p className="text-gray-600">Carregando dados...</p>
                </div>
            </div>
        );
    }

    const ganhos7Dias = extrato
        .filter(
            (t) =>
                t.tipo === "RECEBIMENTO" &&
                new Date(t.data).getTime() >
                    Date.now() - 7 * 24 * 60 * 60 * 1000,
        )
        .reduce((sum, t) => sum + t.moedas, 0);

    const totalResgates = resgates.length;
    const resgatesEssaSemana = resgates.filter(
        (r) =>
            new Date(r.data).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).length;

    const moedasUsadas = resgates.reduce((sum, r) => {
        const vantagem = vantagens.find((v) => v.id === r.vantagemId);
        return sum + (vantagem?.custoMoedas ?? 0);
    }, 0);

    const aproveitamento =
        saldo > 0
            ? Math.round((moedasUsadas / (saldo + moedasUsadas)) * 100)
            : 0;

    const vantagemsAtivas = vantagens.filter((v) => v.status === "ATIVA");

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-purple-200 bg-linear-to-br from-purple-700 via-purple-600 to-purple-800 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-100">
                            Aluno
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">
                            Olá, {user?.nome?.split(" ")[0]}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-purple-100 sm:text-base">
                            Acompanhe seu mérito e troque por vantagens.
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                        <MdWorkspacePremium className="h-7 w-7" />
                    </div>
                </div>
            </div>

            {/* Saldo Card */}
            <div className="rounded-2xl bg-linear-to-br from-purple-600 to-purple-800 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-200 text-sm font-medium">
                            Saldo de moedas
                        </p>
                        <p className="text-4xl font-bold mt-2">{saldo}</p>
                        <p className="text-purple-200 text-sm mt-1">moedas</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <MdAccountBalanceWallet className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* KPIs Section */}
            <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                    Indicadores
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Ganhos */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Ganhos (7 dias)
                            </p>
                            <MdTrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            +{ganhos7Dias}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {
                                extrato.filter(
                                    (t) =>
                                        t.tipo === "RECEBIMENTO" &&
                                        new Date(t.data).getTime() >
                                            Date.now() -
                                                7 * 24 * 60 * 60 * 1000,
                                ).length
                            }{" "}
                            reconhecimento(s)
                        </p>
                    </div>

                    {/* Reconhecimentos */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Reconhecimentos
                            </p>
                            <MdCheckCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {
                                extrato.filter((t) => t.tipo === "RECEBIMENTO")
                                    .length
                            }
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Média de{" "}
                            {extrato.filter((t) => t.tipo === "RECEBIMENTO")
                                .length > 0
                                ? Math.round(
                                      extrato
                                          .filter(
                                              (t) => t.tipo === "RECEBIMENTO",
                                          )
                                          .reduce(
                                              (sum, t) => sum + t.moedas,
                                              0,
                                          ) /
                                          extrato.filter(
                                              (t) => t.tipo === "RECEBIMENTO",
                                          ).length,
                                  )
                                : 0}{" "}
                            moedas/envio
                        </p>
                    </div>

                    {/* Resgates */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Resgates totais
                            </p>
                            <MdCardGiftcard className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {totalResgates}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {resgatesEssaSemana} esta semana
                        </p>
                    </div>

                    {/* Aproveitamento */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Aproveitamento
                            </p>
                            <MdWorkspacePremium className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {aproveitamento}%
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {moedasUsadas} de {saldo + moedasUsadas} moedas
                            usadas
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div>
                <div className="flex gap-2 border-b border-gray-200">
                    {(["vantagens", "extrato", "cupons"] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 font-medium transition border-b-2 ${
                                    activeTab === tab
                                        ? "text-purple-600 border-purple-600"
                                        : "text-gray-600 border-transparent hover:text-gray-900"
                                }`}
                            >
                                {tab === "vantagens"
                                    ? "Vantagens"
                                    : tab === "extrato"
                                      ? "Extrato"
                                      : "Meus cupons"}
                            </button>
                        ),
                    )}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "vantagens" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vantagemsAtivas.length > 0 ? (
                                vantagemsAtivas.map((vantagem) => (
                                    <div
                                        key={vantagem.id}
                                        className="rounded-xl border border-purple-200 overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                                    >
                                        <div className="relative h-36 bg-gradient-to-br from-purple-500 to-purple-700 overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                                <MdCardGiftcard className="h-12 w-12" />
                                            </div>
                                            {vantagem.fotoUrl && (
                                                <img
                                                    src={vantagem.fotoUrl}
                                                    alt={vantagem.nome}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                    onError={(e) => (e.currentTarget as HTMLImageElement).remove()}
                                                />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900">
                                                {vantagem.nome}
                                            </h3>
                                            {vantagem.descricao && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {vantagem.descricao}
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-purple-700 mt-2">
                                                {vantagem.custoMoedas}{" "}
                                                moedas
                                            </p>
                                            <button
                                                onClick={() =>
                                                    handleResgate(vantagem.id)
                                                }
                                                disabled={
                                                    resgatando ===
                                                        vantagem.id ||
                                                    saldo <
                                                        vantagem.custoMoedas
                                                }
                                                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <MdRedeem className="h-4 w-4" />
                                                {resgatando === vantagem.id
                                                    ? "Resgatando..."
                                                    : saldo <
                                                        vantagem.custoMoedas
                                                      ? "Saldo insuficiente"
                                                      : "Resgatar"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-gray-600">
                                    Nenhuma vantagem disponível no momento
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "extrato" && (
                        <div className="space-y-2">
                            {extrato.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                                    Data
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                                    Tipo
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                                    Moedas
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                                    Descrição
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {extrato.map((transacao) => (
                                                <tr
                                                    key={transacao.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-4">
                                                        {new Date(
                                                            transacao.data,
                                                        ).toLocaleDateString(
                                                            "pt-BR",
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                                                transacao.tipo ===
                                                                "RECEBIMENTO"
                                                                    ? "bg-purple-100 text-purple-800"
                                                                    : "bg-purple-50 text-purple-700"
                                                            }`}
                                                        >
                                                            {transacao.tipo}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold text-gray-900">
                                                        {transacao.tipo ===
                                                        "RECEBIMENTO"
                                                            ? "+"
                                                            : "-"}
                                                        {transacao.moedas}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {transacao.descricao ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-600">
                                    Nenhuma transação no histórico
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "cupons" && (
                        <div>
                            {resgates.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Vantagem</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Moedas</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cupom</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resgates.map((resgate) => (
                                                <tr key={resgate.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                                                        {new Date(resgate.data).toLocaleDateString("pt-BR")}
                                                    </td>
                                                    <td className="py-3 px-4 font-medium text-gray-900">
                                                        {resgate.nomeVantagem ?? "—"}
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold text-purple-700">
                                                        -{resgate.custoMoedas ?? "—"}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="inline-flex items-center gap-2">
                                                            <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-mono tracking-wider">
                                                                {resgate.cupom}
                                                            </code>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(resgate.cupom);
                                                                }}
                                                                className="text-purple-400 hover:text-purple-700 transition"
                                                                title="Copiar cupom"
                                                            >
                                                                <MdLocalOffer className="h-4 w-4" />
                                                            </button>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <MdCardGiftcard className="h-10 w-10 mx-auto mb-3 text-purple-200" />
                                    Você ainda não resgatou nenhuma vantagem
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Popup de cupom após resgate */}
            {cupomPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
                        <div className="bg-gradient-to-br from-purple-600 to-purple-800 px-6 py-8 text-center text-white">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                <MdCheckCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-bold">Resgate realizado!</h2>
                            <p className="mt-1 text-sm text-purple-200">
                                {cupomPopup.nomeVantagem}
                            </p>
                        </div>

                        <div className="px-6 py-6 text-center">
                            <p className="text-sm text-gray-500 mb-3">Seu código de cupom</p>
                            <div className="rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 px-6 py-4">
                                <code className="text-2xl font-bold tracking-widest text-purple-700">
                                    {cupomPopup.cupom}
                                </code>
                            </div>
                            <p className="mt-3 text-xs text-gray-400">
                                Apresente este código à empresa para utilizar sua vantagem.
                                O código também foi enviado para seu e-mail.
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(cupomPopup.cupom);
                                    }}
                                    className="flex-1 rounded-xl border border-purple-200 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50 transition"
                                >
                                    Copiar código
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCupomPopup(null);
                                        setActiveTab("cupons");
                                    }}
                                    className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition"
                                >
                                    Ver meus cupons
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCupomPopup(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white"
                        >
                            <MdClose className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
