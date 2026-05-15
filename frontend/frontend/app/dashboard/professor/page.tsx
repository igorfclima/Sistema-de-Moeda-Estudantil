"use client";

import { useEffect, useState } from "react";
import {
    FaChartLine,
    FaChalkboardUser,
    FaCoins,
    FaPaperPlane,
    FaUsers,
} from "react-icons/fa6";
import { MdCancel, MdSend } from "react-icons/md";
import { getUser } from "@/app/lib/api";
import { apiCall } from "@/app/lib/api";

type Aluno = {
    id: string;
    nome: string;
    email: string;
};

type Transaction = {
    id: string;
    tipo: string;
    moedas: number;
    data: string;
    descricao?: string;
};

export default function ProfessorDashboard() {
    const [user, setUser] = useState<any>(null);
    const [saldo, setSaldo] = useState(0);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [extrato, setExtrato] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAluno, setSelectedAluno] = useState<string>("");
    const [moedas, setMoedas] = useState("");
    const [motivo, setMotivo] = useState("");
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState<"alunos" | "extrato">("alunos");

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

                const [saldoData, alunosData, extratoData] = await Promise.all([
                    apiCall(`/api/professores/${currentUser.id}/saldo`).catch(
                        () => 0,
                    ),
                    apiCall(`/api/professores/${currentUser.id}/alunos`).catch(
                        () => [],
                    ),
                    apiCall(`/api/professores/${currentUser.id}/extrato`).catch(
                        () => [],
                    ),
                ]);

                setSaldo(typeof saldoData === "number" ? saldoData : 0);
                setAlunos(Array.isArray(alunosData) ? alunosData : []);
                setExtrato(Array.isArray(extratoData) ? extratoData : []);
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

    async function handleEnviarMoedas(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);

        try {
            await apiCall(`/api/professores/${user.id}/enviar-moedas`, {
                method: "POST",
                body: JSON.stringify({
                    alunoId: selectedAluno,
                    quantidade: parseInt(moedas),
                    motivo,
                }),
            });

            // Reload data
            const [saldoData, extratoData] = await Promise.all([
                apiCall(`/api/professores/${user.id}/saldo`).catch(() => 0),
                apiCall(`/api/professores/${user.id}/extrato`).catch(() => []),
            ]);

            setSaldo(typeof saldoData === "number" ? saldoData : 0);
            setExtrato(Array.isArray(extratoData) ? extratoData : []);

            // Reset form
            setSelectedAluno("");
            setMoedas("");
            setMotivo("");
            setShowModal(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao enviar moedas");
        } finally {
            setSending(false);
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

    const totalEnviado = extrato
        .filter((t) => t.tipo === "ENVIO")
        .reduce((sum, t) => sum + t.moedas, 0);

    const enviaments7Dias = extrato
        .filter(
            (t) =>
                t.tipo === "ENVIO" &&
                new Date(t.data).getTime() >
                    Date.now() - 7 * 24 * 60 * 60 * 1000,
        )
        .reduce((sum, t) => sum + t.moedas, 0);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-purple-200 bg-linear-to-br from-purple-700 via-purple-600 to-purple-800 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-100">
                            Professor
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">
                            Olá, {user?.nome?.split(" ")[0]}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-purple-100 sm:text-base">
                            Gerencie seus alunos e distribua moedas de mérito.
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                        <FaChalkboardUser className="h-7 w-7" />
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
                        <FaCoins className="h-6 w-6" />
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
                    {/* Saldo */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Saldo atual
                            </p>
                            <FaCoins className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {saldo}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            moedas disponíveis
                        </p>
                    </div>

                    {/* Alunos */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Alunos
                            </p>
                            <FaUsers className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {alunos.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">vinculados</p>
                    </div>

                    {/* Total Enviado */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Total enviado
                            </p>
                            <FaPaperPlane className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {totalEnviado}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            moedas distribuídas
                        </p>
                    </div>

                    {/* Últimos 7 dias */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                                Enviados (7d)
                            </p>
                            <FaChartLine className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {enviaments7Dias}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            última semana
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div>
                <div className="flex gap-2 border-b border-gray-200 mb-6">
                    {(["alunos", "extrato"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium transition border-b-2 ${
                                activeTab === tab
                                    ? "text-purple-600 border-purple-600"
                                    : "text-gray-600 border-transparent hover:text-gray-900"
                            }`}
                        >
                            {tab === "alunos" ? "Meus alunos" : "Extrato"}
                        </button>
                    ))}
                    {activeTab === "alunos" && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="ml-auto inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                        >
                            <MdSend className="h-4 w-4" />
                            Enviar moedas
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                {activeTab === "alunos" && (
                    <div className="overflow-x-auto">
                        {alunos.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                            Nome
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                            Email
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                            Ação
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alunos.map((aluno) => (
                                        <tr
                                            key={aluno.id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 font-medium text-gray-900">
                                                {aluno.nome}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {aluno.email}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAluno(
                                                            aluno.id,
                                                        );
                                                        setShowModal(true);
                                                    }}
                                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                                >
                                                    Enviar moedas
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-600">
                                Você não tem alunos vinculados ainda
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "extrato" && (
                    <div className="overflow-x-auto">
                        {extrato.length > 0 ? (
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
                                                ).toLocaleDateString("pt-BR")}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                                        transacao.tipo ===
                                                        "ENVIO"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-purple-50 text-purple-700"
                                                    }`}
                                                >
                                                    {transacao.tipo}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-gray-900">
                                                {transacao.tipo === "ENVIO"
                                                    ? "-"
                                                    : "+"}
                                                {transacao.moedas}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {transacao.descricao || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-600">
                                Nenhuma transação no histórico
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <FaPaperPlane className="h-5 w-5 text-purple-600" />
                                Enviar moedas
                            </h3>
                        </div>

                        <form
                            onSubmit={handleEnviarMoedas}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecione o aluno
                                </label>
                                <select
                                    value={selectedAluno}
                                    onChange={(e) =>
                                        setSelectedAluno(e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">
                                        {alunos.length > 0
                                            ? "Escolha um aluno..."
                                            : "Nenhum aluno disponível"}
                                    </option>
                                    {alunos.map((aluno) => (
                                        <option key={aluno.id} value={aluno.id}>
                                            {aluno.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantidade de moedas
                                </label>
                                <input
                                    type="number"
                                    value={moedas}
                                    onChange={(e) => setMoedas(e.target.value)}
                                    min="1"
                                    max={saldo}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ex.: 10"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Saldo disponível: {saldo} moedas
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo
                                </label>
                                <input
                                    type="text"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ex.: Participação em aula"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedAluno("");
                                        setMoedas("");
                                        setMotivo("");
                                    }}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-purple-200 text-purple-700 font-medium hover:bg-purple-50"
                                >
                                    <MdCancel className="h-4 w-4" />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                                >
                                    <MdSend className="h-4 w-4" />
                                    {sending ? "Enviando..." : "Enviar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
