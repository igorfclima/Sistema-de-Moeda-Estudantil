"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from "@/app/lib/api";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.push("/");
            return;
        }

        // Map role to dashboard path
        const roleMap: { [key: string]: string } = {
            ROLE_ALUNO: "/dashboard/aluno",
            ROLE_PROFESSOR: "/dashboard/professor",
            ROLE_EMPRESA: "/dashboard/empresa",
            ROLE_ADMIN: "/dashboard/admin",
        };

        const expectedPath = roleMap[currentUser.tipoUsuario];
        if (expectedPath && !pathname.startsWith(expectedPath)) {
            // Redirect to correct role dashboard
            router.push(expectedPath);
            return;
        }

        setUser(currentUser);
        setLoading(false);
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#f5f3ff] to-[#faf9ff]">
                <div className="text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600 mx-auto mb-4 animate-spin"></div>
                    <p className="text-gray-600">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f5f3ff] to-[#faf9ff]">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-xs font-bold text-white">
                            ★
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                SME
                            </p>
                            <p className="text-xs text-gray-500">
                                Sistema de Mérito
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
