"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/app/lib/api";
import { FaSchool, FaChalkboardUser, FaGraduationCap } from "react-icons/fa6";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

interface Instituicao {
    id: string;
    nome: string;
    cnpj: string;
    ativa: boolean;
    professores?: any[];
    alunos?: any[];
}

export default function InstituicoesPage() {
    const router = useRouter();
    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadInstituicoes = async () => {
        try {
            setLoading(true);
            const data = await apiCall("/api/admin/instituicoes", {});
            setInstituicoes(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Erro ao carregar instituições:", err);
            setError(
                "Não foi possível carregar as instituições. Tente novamente.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInstituicoes();
    }, []);

    const handleDelete = async (id: string, nome: string) => {
        if (
            !window.confirm(
                `Tem certeza que deseja deletar a instituição "${nome}"?`,
            )
        ) {
            return;
        }

        try {
            setDeleting(id);
            await apiCall(`/api/admin/instituicoes/${id}`, {
                method: "DELETE",
            });
            setSuccess(`Instituição "${nome}" deletada com sucesso.`);
            await loadInstituicoes();
        } catch (err) {
            console.error("Erro ao deletar instituição:", err);
            setError("Não foi possível deletar a instituição.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium mb-4 transition"
                >
                    ← Voltar ao painel
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Instituições
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Gerencie todas as instituições do sistema
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin/instituicoes/criar"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg transition"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                    >
                        <MdAdd className="text-xl" />
                        Criar Instituição
                    </Link>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 text-sm">
                    {success}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                </div>
            ) : instituicoes.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <p className="text-gray-600 font-medium">
                        Nenhuma instituição cadastrada
                    </p>
                    <Link
                        href="/dashboard/admin/instituicoes/criar"
                        className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Criar Primeira Instituição
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {instituicoes.map((inst) => (
                        <div
                            key={inst.id}
                            className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {inst.nome}
                                        </h3>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                inst.ativa
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {inst.ativa ? "Ativa" : "Inativa"}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>CNPJ:</strong> {inst.cnpj}
                                    </p>
                                    <div className="mt-3 flex gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <FaChalkboardUser className="text-purple-600" />
                                            {inst.professores?.length || 0}{" "}
                                            professor(es)
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaGraduationCap className="text-purple-600" />
                                            {inst.alunos?.length || 0} aluno(s)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/admin/instituicoes/${inst.id}/editar`}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                                    >
                                        <MdEdit />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(inst.id, inst.nome)
                                        }
                                        disabled={deleting === inst.id}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                                    >
                                        <MdDelete />
                                        {deleting === inst.id
                                            ? "Deletando..."
                                            : "Deletar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
