import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";
import { useBoard } from "../hooks/useBoard";
import { useParams } from "react-router-dom";
import { useColumns } from "../hooks/useColumns";
import { invalidateAllPlacements, usePlacements } from "../hooks/usePlacements";
import { useQueryClient } from "@tanstack/react-query";
import { useBoardHub } from "../hooks/useBoardHub";
import type { BoardId } from "../types/board";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  console.log("ID FROM URL:", id);

  const { data: columns = [] } = useColumns();

  const queryClient = useQueryClient();

  useBoardHub(() => invalidateAllPlacements(queryClient));

  
  const boardQuery = useBoard();
  
  if (!id) {
    return <p>Board ID is missing.</p>;
  }

  const boardId: BoardId = { id: id };
  
  const {
    data: placements = [],
    isLoading: placementsLoading,
    isError: placementsError,
  } = usePlacements(boardId);

  if (boardQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (boardQuery.isError) {
    return <p>Could not load board.</p>;
  }

  if (!boardQuery.data) {
    return <p>Board not found.</p>;
  }

  if (placementsLoading) {
    return <p>Loading...</p>;
  }

  if (placementsError) {
    return <p>Could not load placements.</p>;
  }

  return (
    <>
      <BoardHeader board={boardQuery.data} />

      <ColumnList columns={columns} placements={placements} boardId={boardId} />
    </>
  );
}
