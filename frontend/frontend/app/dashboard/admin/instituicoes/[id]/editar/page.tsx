"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiCall, getToken } from "@/app/lib/api";
import { FaArrowLeft } from "react-icons/fa6";
import { MdCheckCircle } from "react-icons/md";

interface Instituicao {
    id: string;
    nome: string;
    cnpj: string;
    ativa: boolean;
    professores?: any[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function EditarInstituicaoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [formData, setFormData] = useState({
        nome: "",
        cnpj: "",
    });
    const [instituicao, setInstituicao] = useState<Instituicao | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstituicao = async () => {
            try {
                setLoading(true);
                const data = await apiCall(`/api/admin/instituicoes`, {});
                const found = Array.isArray(data)
                    ? data.find((i: any) => i.id === id)
                    : null;

                if (found) {
                    setInstituicao(found);
                    setFormData({
                        nome: found.nome || "",
                        cnpj: found.cnpj || "",
                    });
                } else {
                    setError("Instituição não encontrada");
                }
            } catch (err) {
                console.error("Erro ao carregar instituição:", err);
                setError("Não foi possível carregar a instituição");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInstituicao();
        }
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome.trim() || !formData.cnpj.trim()) {
            setError("Nome e CNPJ são obrigatórios.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const token = getToken();
            const response = await fetch(
                `${API_URL}/api/admin/instituicoes/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`,
                    },
                    body: `nome=${encodeURIComponent(formData.nome)}&cnpj=${encodeURIComponent(formData.cnpj)}`,
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erro ao atualizar instituição",
                );
            }

            setSuccess("Instituição atualizada com sucesso!");

            setTimeout(() => {
                router.push("/dashboard/admin/instituicoes");
            }, 2000);
        } catch (err) {
            console.error("Erro ao atualizar instituição:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Erro ao atualizar instituição",
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="h-8 w-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            </div>
        );
    }

    if (!instituicao) {
        return (
            <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-red-700">
                {error || "Instituição não encontrada"}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/admin/instituicoes"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                    <FaArrowLeft />
                    Voltar
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">
                    Editar Instituição
                </h1>
                <p className="mt-2 text-gray-600">
                    Atualize as informações da instituição
                </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Nome da Instituição
                                </span>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    CNPJ
                                </span>
                                <input
                                    type="text"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {saving ? (
                                        "Salvando..."
                                    ) : (
                                        <>
                                            <MdCheckCircle /> Salvar
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/dashboard/admin/instituicoes"
                                    className="flex-1 px-6 py-3 rounded-lg border border-purple-300 text-purple-700 font-medium hover:bg-purple-50 transition text-center"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-4">
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                        <h3 className="font-bold text-purple-900 mb-3">
                            Informações
                        </h3>
                        <div className="space-y-2 text-xs text-purple-800">
                            <div>
                                <strong>Professores:</strong>{" "}
                                {instituicao.professores?.length || 0}
                            </div>
                            <div>
                                <strong>Status:</strong>{" "}
                                {instituicao.ativa ? "Ativa" : "Inativa"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
