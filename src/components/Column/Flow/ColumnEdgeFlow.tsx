import { useColumns } from "../../../hooks/useColumns";
import { useColumnEdges } from "../../../hooks/useColumnEdges";

import ColumnEdgeFlowContent from "./ColumnEdgeFlowContent";
import { useBoard } from "../../../hooks/useBoard";

export default function ColumnEdgeFlow() {
  const board1Id = "11111111-1111-1111-1111-111111111111";
  const board2Id = "11111111-1111-1111-1111-111111111112";

  const { data: board1, isLoading: board1Loading } = useBoard(board1Id);

  const { data: board2, isLoading: board2Loading } = useBoard(board2Id);

  const { data: board1Columns = [], isLoading: board1ColumnsLoading } =
    useColumns(board1Id);

  const { data: board2Columns = [], isLoading: board2ColumnsLoading } =
    useColumns(board2Id);

  const { data: board1Edges = [], isLoading: board1EdgesLoading } =
    useColumnEdges(board1Id);

  if (
    board1Loading ||
    board2Loading ||
    board1ColumnsLoading ||
    board2ColumnsLoading ||
    board1EdgesLoading ||
    !board1 ||
    !board2
  ) {
    return null;
  }

  return (
    <ColumnEdgeFlowContent
      board1={board1}
      board2={board2}
      board1Columns={board1Columns}
      board2Columns={board2Columns}
      board1Edges={board1Edges}
    />
  );
}
