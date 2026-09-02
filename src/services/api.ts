const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${API_URL}${path}`,
        options
    );

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const responseString = await response.text();

    if (responseString === "") {
        return undefined as T;
    }

    return JSON.parse(responseString) as T;
}