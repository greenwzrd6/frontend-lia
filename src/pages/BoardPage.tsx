import { useState } from "react";
import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";
import type { Entity } from "../types/entity";
import { mockEntities } from "../services/mockEntities";
import { useQueryClient } from "@tanstack/react-query";
import { useBoard } from "../hooks/useBoard";
import { useParams } from "react-router-dom";
import { useColumns } from "../hooks/useColumns";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const boardQuery = useBoard();

  const columnsQuery = useColumns();

  const [entities] = useState<Entity[]>(mockEntities);

  const queryClient = useQueryClient();

  async function getPlacements() {
    await queryClient.invalidateQueries({ queryKey: ["placements", id] });
  }

  if (!id) {
    return "Board ID is missing.";
  }

  if (boardQuery.isLoading || columnsQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (boardQuery.isError || columnsQuery.isError) {
    return <p>Could not load board.</p>;
  }

  if (!boardQuery.data) {
    return <p>Board not found.</p>;
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col">
      <BoardHeader board={boardQuery.data} />

      <ColumnList
        entities={entities}
        getPlacements={getPlacements}
      />
    </main>
  );
}
