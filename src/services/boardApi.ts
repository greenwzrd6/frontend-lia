import type { Board } from "../types/board";

const API_URL = "https://localhost:7265";

export async function getBoard(id: string): Promise<Board> {
    const response = await fetch(
        `${API_URL}/api/boards/${id}`
    );

    if (!response.ok) {
        throw new Error("Something went wrong trying to fetch the board");
    }

    return response.json();
}