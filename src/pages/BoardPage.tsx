import { useParams } from "react-router-dom";

import BoardHeader from "../components/Board/BoardHeader";
import BoardDnd from "../components/Board/BoardDnd";

import { useBoard } from "../hooks/useBoard";
import { useColumns } from "../hooks/useColumns";
import { getDescendants } from "../utils/entityTree";
import { useEntities } from "../hooks/useEntities";
import { useEffect } from "react";
import { placementKeys } from "../utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const { data: columns = [] } = useColumns();
  const { data: entities = [] } = useEntities();

  const boardQuery = useBoard();

  const qc = useQueryClient();

  //refetch when switching boards, might be bad
  useEffect(() => {
    if (!id) return;

    qc.invalidateQueries({
      queryKey: placementKeys.all,
    });
  }, [id, qc]);

  const boardEntities = boardQuery.data
    ? getDescendants(entities, boardQuery.data.roots)
    : [];

  if (!id) {
    return <p>Board ID is missing.</p>;
  }

  if (boardQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (boardQuery.isError) {
    return <p>Could not load board.</p>;
  }

  if (!boardQuery.data) {
    return <p>Board not found.</p>;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <BoardHeader board={boardQuery.data} />

      <main className="flex-1 min-h-0">
        <BoardDnd columns={columns} boardId={id} entities={boardEntities} />
      </main>
    </div>
  );
}
