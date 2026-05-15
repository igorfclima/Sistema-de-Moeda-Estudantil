const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiCall(
    endpoint: string,
    options: RequestInit & { requiresAuth?: boolean } = {},
) {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers || {});

    if (requiresAuth) {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("sme.token")
                : null;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    headers.set("Content-Type", "application/json");

    const response = await fetch(`${apiUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `API Error: ${response.statusText}`,
        );
    }

    return response.json();
}

export function getUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("sme.user");
    return user ? JSON.parse(user) : null;
}

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("sme.token");
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("sme.token");
        localStorage.removeItem("sme.user");
    }
}
