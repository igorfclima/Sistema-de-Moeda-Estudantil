"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/app/lib/api";
import { MdCloudUpload, MdCheckCircle } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";

interface ParsedProfessor {
    nome?: string;
    cpf?: string;
    email?: string;
    departamento?: string;
    loginDesejado?: string;
    senhaDesejada?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function CriarInstituicaoPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: "",
        cnpj: "",
    });
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [parsedProfessors, setParsedProfessors] = useState<ParsedProfessor[]>(
        [],
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
            // Mostrar nome do arquivo
            setPreview(`Arquivo selecionado: ${file.name}`);
            setError(null);
        }
    };

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
            setLoading(true);
            setError(null);

            const formDataObj = new FormData();
            formDataObj.append("nome", formData.nome);
            formDataObj.append("cnpj", formData.cnpj);
            if (pdfFile) {
                formDataObj.append("file", pdfFile);
            }

            const token = getToken();
            const response = await fetch(`${API_URL}/api/admin/instituicoes`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataObj,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erro ao criar instituição",
                );
            }

            const result = await response.json();
            setSuccess(
                `Instituição "${formData.nome}" criada com sucesso${
                    pdfFile ? " e professores cadastrados!" : "!"
                }`,
            );

            setTimeout(() => {
                router.push("/dashboard/admin/instituicoes");
            }, 2000);
        } catch (err) {
            console.error("Erro ao criar instituição:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Erro ao criar instituição",
            );
        } finally {
            setLoading(false);
        }
    };

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
                    Criar Instituição
                </h1>
                <p className="mt-2 text-gray-600">
                    Adicione uma nova instituição ao sistema. Opcionalmente,
                    envie um PDF com as informações dos professores.
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
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Informações da Instituição
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Nome da Instituição *
                                </span>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    placeholder="Ex.: Instituto Federal do Vale"
                                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    CNPJ *
                                </span>
                                <input
                                    type="text"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleInputChange}
                                    placeholder="00.000.000/0000-00"
                                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Enviar PDF (Opcional)
                                </span>
                                <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-6 hover:bg-purple-100 transition cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label
                                        htmlFor="pdf-upload"
                                        className="w-full text-center cursor-pointer"
                                    >
                                        {preview ? (
                                            <div className="space-y-2">
                                                <p className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium">
                                                    <MdCheckCircle className="text-lg" />
                                                    {preview}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Clique para alterar
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="flex items-center justify-center gap-2 text-sm font-medium text-purple-900">
                                                    <MdCloudUpload className="text-2xl text-purple-600" />
                                                    Arraste um PDF aqui ou
                                                    clique
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    O PDF será processado para
                                                    extrair dados de professores
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        "Criando..."
                                    ) : (
                                        <>
                                            <MdCheckCircle /> Criar
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
                            Formato do PDF
                        </h3>
                        <p className="text-xs text-purple-800 mb-3">
                            O PDF deve conter as informações no seguinte
                            formato:
                        </p>
                        <code className="block bg-white p-3 rounded text-xs font-mono text-gray-800 space-y-1 overflow-auto max-h-40 border border-purple-200">
                            <div>INSTITUICAO: Nome da Instituição</div>
                            <div>CNPJ: 12.345.678/0001-90</div>
                            <div className="text-purple-600 font-semibold">
                                PROFESSOR: Nome | CPF | email | depto | login |
                                senha
                            </div>
                            <div>
                                Ex: João Silva | 123.456.789-00 | joao@ex.edu |
                                Matemática | joao.silva | Senha123
                            </div>
                        </code>
                    </div>

                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                        <h3 className="font-bold text-purple-900 mb-2">
                            Sem PDF?
                        </h3>
                        <p className="text-xs text-purple-800">
                            Você pode criar a instituição sem PDF agora e
                            adicionar professores depois manualmente.
                        </p>
                    </div>

                    <div className="rounded-lg bg-purple-100 border border-purple-300 p-4">
                        <h3 className="font-bold text-purple-900 mb-2">
                            Importante
                        </h3>
                        <ul className="text-xs text-purple-800 space-y-1">
                            <li>• CPF e Email devem ser únicos no sistema</li>
                            <li>
                                • Um PDF será gerado com as credenciais criadas
                            </li>
                            <li>
                                • Professores receberão email com dados de
                                acesso
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
