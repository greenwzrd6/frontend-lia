import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBoard } from "../services/boardApi";
import type { Board } from "../types/board";
import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";
import type { Column } from "../types/column";
import { getColumnsByBoardId } from "../services/columnApi";
import { getPlacement } from "../services/placementApi";
import type { Entity } from "../types/entity";
import { mockEntities } from "../services/mockEntities";
import type { Placement } from "../types/placement";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const [board, setBoard] = useState<Board | null>(null);

  const [columns, setColumns] = useState<Column[]>([]);

  const [placements, setPlacements] = useState<Placement[]>([]);

  const [entities] = useState<Entity[]>(mockEntities);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const ID = id;

    async function loadBoard() {
      try {
        setLoading(true);
        setError(null);

        const board = await getBoard(ID);

        const columns = await getColumnsByBoardId(ID);

        const columnIds = columns.map((column) => column.id);

        let placementsData: Placement[] = [];

        for (let entity in entities) {
          const placement = await getPlacement(entity, columnIds);
          if (placement) {
            placementsData.push(placement);
          }
        }

        setPlacements(placementsData);
        setBoard(board);
        setColumns(columns);
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
    <main className="mx-auto flex max-w-sm flex-col">
      <BoardHeader board={board} />
      
      <ColumnList
        columns={columns}
        placements={placements}
        entities={entities}
      ></ColumnList>
    </main>
  );
}
