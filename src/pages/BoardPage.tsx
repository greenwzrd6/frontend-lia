import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBoard } from "../services/boardApi";
import type { Board } from "../types/board";
import BoardHeader from "../components/Board/BoardHeader";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const [board, setBoard] = useState<Board | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const boardId = id;

    async function loadBoard() {
      try {
        setLoading(true);
        setError(null);

        const result = await getBoard(boardId);

        setBoard(result);
      } catch {
        setError("Could not load board.");
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [id]);

  if (!id) {
    return <p>Board ID is missing.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!board) {
    return <p>Board not found.</p>;
  }

  return (
    <main>
      <BoardHeader board={board} />

      <div>Column area will be integrated later.</div>
    </main>
  );
}
