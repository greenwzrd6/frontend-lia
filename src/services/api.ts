export const API_URL = import.meta.env.VITE_API_URL;
export const TOJ_API_URL = import.meta.env.VITE_TOJ_API_URL;

export async function apiRequest<T>(
    path: string,
    options?: RequestInit,
    baseUrl: string = API_URL,
): Promise<T> {
    const response = await fetch(
        `${baseUrl}${path}`,
        options
    );

if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
        `API request failed: ${response.status} - ${errorBody}`
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