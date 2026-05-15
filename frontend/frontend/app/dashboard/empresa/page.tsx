"use client";

import { useEffect, useState } from "react";
import {
    MdCardGiftcard,
    MdCheckCircle,
    MdClose,
    MdLocalOffer,
    MdRedeem,
    MdTrendingUp,
    MdWorkspacePremium,
    MdImage,
    MdAddCircle,
    MdToggleOn,
    MdToggleOff,
} from "react-icons/md";
import { getUser, apiCall } from "@/app/lib/api";

type Vantagem = {
    id: string;
    nome: string;
    descricao: string;
    fotoUrl: string | null;
    custoMoedas: number;
    status: string;
    empresaParceiraId: string;
};

type Resgate = {
    id: string;
    data: string;
    cupom: string;
    nomeAluno: string;
    nomeVantagem: string;
    custoMoedas: number;
};

export default function EmpresaDashboard() {
    const [user, setUser] = useState<any>(null);
    const [vantagens, setVantagens] = useState<Vantagem[]>([]);
    const [resgates, setResgates] = useState<Resgate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"vantagens" | "resgates">("vantagens");
    const [showModal, setShowModal] = useState(false);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [fotoUrl, setFotoUrl] = useState("");
    const [moedas, setMoedas] = useState("");
    const [creating, setCreating] = useState(false);
    const [cupomFilter, setCupomFilter] = useState("");

    async function loadData(currentUser: any) {
        const [vantagemsData, resgatesData] = await Promise.all([
            apiCall(`/api/vantagens/todas`).catch(() => []),
            apiCall(`/api/empresas/${currentUser.id}/resgates`).catch(() => []),
        ]);

        const todasVantagens = Array.isArray(vantagemsData) ? vantagemsData : [];
        const minhasVantagens = todasVantagens.filter(
            (v: Vantagem) => v.empresaParceiraId === currentUser.id,
        );
        setVantagens(minhasVantagens);
        setResgates(Array.isArray(resgatesData) ? resgatesData : []);
    }

    useEffect(() => {
        async function init() {
            try {
                const currentUser = getUser();
                setUser(currentUser);
                if (!currentUser?.id) {
                    setError("Usuário não autenticado");
                    setLoading(false);
                    return;
                }
                await loadData(currentUser);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    async function handleCreateVantagem(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        try {
            await apiCall(`/api/vantagens`, {
                method: "POST",
                body: JSON.stringify({
                    nome,
                    descricao,
                    fotoUrl: fotoUrl || null,
                    custoMoedas: parseInt(moedas),
                    empresaParceiraId: user.id,
                    status: "ATIVA",
                }),
            });
            setNome("");
            setDescricao("");
            setFotoUrl("");
            setMoedas("");
            setShowModal(false);
            await loadData(user);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao criar vantagem");
        } finally {
            setCreating(false);
        }
    }

    async function handleToggleVantagem(vantagemId: string, currentStatus: string) {
        try {
            await apiCall(`/api/vantagens/${vantagemId}`, {
                method: "PUT",
                body: JSON.stringify({
                    status: currentStatus === "ATIVA" ? "INATIVA" : "ATIVA",
                }),
            });
            await loadData(user);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao atualizar vantagem");
        }
    }

    async function handleValidarCupom(cupom: string) {
        try {
            await apiCall(`/api/resgate/validar/${cupom}`);
            alert("Cupom validado e marcado como utilizado!");
            await loadData(user);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Cupom inválido ou já utilizado");
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

    const vantagemsAtivas = vantagens.filter((v) => v.status === "ATIVA");
    const totalResgates = resgates.length;
    const moedasColetadas = resgates.reduce((sum, r) => sum + (r.custoMoedas ?? 0), 0);
    const filteredResgates = cupomFilter
        ? resgates.filter(
              (r) =>
                  r.cupom?.toLowerCase().includes(cupomFilter.toLowerCase()) ||
                  r.nomeAluno?.toLowerCase().includes(cupomFilter.toLowerCase()),
          )
        : resgates;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl border border-purple-200 bg-linear-to-br from-purple-700 via-purple-600 to-purple-800 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-100">
                            Empresa parceira
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">
                            {user?.nomeEmpresa || user?.nome}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-purple-100 sm:text-base">
                            Gerencie suas vantagens e acompanhe os resgates dos alunos.
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                        <MdWorkspacePremium className="h-7 w-7" />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-linear-to-br from-purple-600 to-purple-800 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-sm font-medium">Total de resgates</p>
                            <p className="text-4xl font-bold mt-2">{totalResgates}</p>
                        </div>
                        <MdCardGiftcard className="h-10 w-10 text-white/60" />
                    </div>
                </div>
                <div className="rounded-2xl bg-linear-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Moedas recebidas</p>
                            <p className="text-4xl font-bold mt-2">{moedasColetadas}</p>
                        </div>
                        <MdTrendingUp className="h-10 w-10 text-white/60" />
                    </div>
                </div>
                <div className="rounded-2xl bg-linear-to-br from-purple-600 to-purple-900 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Vantagens ativas</p>
                            <p className="text-4xl font-bold mt-2">{vantagemsAtivas.length}</p>
                        </div>
                        <MdCheckCircle className="h-10 w-10 text-white/60" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div>
                <div className="flex gap-2 border-b border-purple-200 mb-6">
                    {(["vantagens", "resgates"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium transition border-b-2 ${
                                activeTab === tab
                                    ? "text-purple-600 border-purple-600"
                                    : "text-purple-400 border-transparent hover:text-purple-700"
                            }`}
                        >
                            {tab === "vantagens" ? "Minhas vantagens" : "Resgates"}
                        </button>
                    ))}
                    {activeTab === "vantagens" && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="ml-auto inline-flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                        >
                            <MdAddCircle className="h-4 w-4" />
                            Nova vantagem
                        </button>
                    )}
                </div>

                {activeTab === "vantagens" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vantagens.length > 0 ? (
                            vantagens.map((vantagem) => (
                                <div
                                    key={vantagem.id}
                                    className={`rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition ${
                                        vantagem.status === "ATIVA"
                                            ? "border-purple-200 bg-white"
                                            : "border-gray-100 bg-gray-50 opacity-70"
                                    }`}
                                >
                                    {/* Foto */}
                                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <MdImage className="h-16 w-16 text-purple-300" />
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
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-gray-900">{vantagem.nome}</h3>
                                            <span
                                                className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                                                    vantagem.status === "ATIVA"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {vantagem.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {vantagem.descricao}
                                        </p>
                                        <p className="text-sm font-bold text-purple-700 mt-2">
                                            {vantagem.custoMoedas} moedas
                                        </p>
                                        <button
                                            onClick={() => handleToggleVantagem(vantagem.id, vantagem.status)}
                                            className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition text-sm ${
                                                vantagem.status === "ATIVA"
                                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    : "bg-purple-600 text-white hover:bg-purple-700"
                                            }`}
                                        >
                                            {vantagem.status === "ATIVA" ? (
                                                <><MdToggleOff className="h-4 w-4" /> Desativar</>
                                            ) : (
                                                <><MdToggleOn className="h-4 w-4" /> Ativar</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-purple-600">
                                <MdCardGiftcard className="h-12 w-12 mx-auto mb-3 text-purple-300" />
                                <p>Nenhuma vantagem criada ainda</p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-3 text-sm font-medium text-purple-600 hover:underline"
                                >
                                    Criar primeira vantagem
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "resgates" && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Filtrar por cupom ou aluno..."
                            value={cupomFilter}
                            onChange={(e) => setCupomFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />

                        {filteredResgates.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Aluno</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Vantagem</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Cupom</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Moedas</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResgates.map((resgate) => (
                                            <tr key={resgate.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-600">
                                                    {new Date(resgate.data).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-900">
                                                    {resgate.nomeAluno}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">{resgate.nomeVantagem}</td>
                                                <td className="py-3 px-4">
                                                    <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-mono">
                                                        {resgate.cupom}
                                                    </code>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-purple-700">
                                                    {resgate.custoMoedas}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleValidarCupom(resgate.cupom)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition"
                                                    >
                                                        <MdRedeem className="h-3 w-3" />
                                                        Validar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-purple-600">
                                <MdLocalOffer className="h-12 w-12 mx-auto mb-3 text-purple-300" />
                                <p>Nenhum resgate registrado ainda</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Nova Vantagem */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                        <div className="px-6 py-4 border-b border-purple-200 bg-purple-50 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-900">
                                <MdCardGiftcard className="h-5 w-5 text-purple-600" />
                                Nova vantagem
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-purple-400 hover:text-purple-700">
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateVantagem} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome da vantagem <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ex.: Café grátis"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder="Descreva a vantagem oferecida"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL da foto do produto
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={fotoUrl}
                                        onChange={(e) => setFotoUrl(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/foto.jpg"
                                    />
                                    {fotoUrl && (
                                        <img
                                            src={fotoUrl}
                                            alt="preview"
                                            className="h-10 w-10 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Cole a URL de uma imagem do produto
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custo em moedas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={moedas}
                                    onChange={(e) => setMoedas(e.target.value)}
                                    min="1"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ex.: 50"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setNome("");
                                        setDescricao("");
                                        setFotoUrl("");
                                        setMoedas("");
                                    }}
                                    className="flex-1 px-4 py-2 border border-purple-200 rounded-lg text-purple-700 font-medium hover:bg-purple-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                                >
                                    {creating ? "Criando..." : "Criar vantagem"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
