"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/app/lib/api";
import { FaSchool, FaChalkboardUser, FaGraduationCap } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

interface DashboardStats {
    instituicoes: number;
    professores: number;
    alunos: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        instituicoes: 0,
        professores: 0,
        alunos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [instResp, profResp, alunoResp] = await Promise.all([
                    apiCall("/api/admin/instituicoes", {}),
                    apiCall("/api/professores", {}),
                    apiCall("/api/alunos", {}),
                ]);

                setStats({
                    instituicoes: Array.isArray(instResp) ? instResp.length : 0,
                    professores: Array.isArray(profResp) ? profResp.length : 0,
                    alunos: Array.isArray(alunoResp) ? alunoResp.length : 0,
                });
            } catch (error) {
                console.error("Erro ao carregar estatísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Painel de Administração
                </h1>
                <p className="mt-2 text-gray-600">
                    Gerencie instituições, professores e usuários do sistema.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-lg hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">
                                Instituições
                            </p>
                            <p className="text-4xl font-bold mt-2">
                                {loading ? "-" : stats.instituicoes}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-500 rounded-lg">
                            <FaSchool className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">
                                Professores
                            </p>
                            <p className="text-4xl font-bold mt-2">
                                {loading ? "-" : stats.professores}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-400 rounded-lg">
                            <FaChalkboardUser className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 p-6 text-white shadow-lg hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">
                                Alunos
                            </p>
                            <p className="text-4xl font-bold mt-2">
                                {loading ? "-" : stats.alunos}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-300 rounded-lg">
                            <FaGraduationCap className="text-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/dashboard/admin/instituicoes"
                    className="rounded-lg border-2 border-purple-200 bg-white p-6 hover:bg-purple-50 hover:border-purple-400 transition"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Gerenciar Instituições
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Criar, editar e deletar instituições do sistema.
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <FaSchool className="text-2xl" />
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/admin/instituicoes/criar"
                    className="rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white hover:shadow-lg transition flex items-start justify-between"
                >
                    <div>
                        <h3 className="text-lg font-bold">Criar Instituição</h3>
                        <p className="mt-2 text-sm text-purple-100">
                            Adicionar nova instituição e professores via PDF.
                        </p>
                    </div>
                    <div className="p-2 bg-purple-500 rounded-lg">
                        <MdAdd className="text-2xl" />
                    </div>
                </Link>
            </div>

            {/* Help Section */}
            <div className="rounded-lg bg-purple-50 border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4">
                    Como Usar
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                    <li>
                        • Acesse "Gerenciar Instituições" para visualizar todas
                        as instituições cadastradas
                    </li>
                    <li>
                        • Use "Criar Instituição" para adicionar nova
                        instituição (com ou sem PDF)
                    </li>
                    <li>
                        • O PDF deve conter linhas no formato:
                        <code className="block mt-2 bg-white p-2 rounded text-xs font-mono">
                            INSTITUICAO: Nome da Instituição
                            <br />
                            CNPJ: 12.345.678/0001-90
                            <br />
                            PROFESSOR: Nome | CPF | email@dominio.com | Depto |
                            login | senha
                        </code>
                    </li>
                </ul>
            </div>
        </div>
    );
}
