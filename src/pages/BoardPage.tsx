import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";
import { useBoard } from "../hooks/useBoard";
import { useParams } from "react-router-dom";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const boardQuery = useBoard();

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
    <>
      <BoardHeader board={boardQuery.data} />

      <ColumnList />
    </>
  );
}
