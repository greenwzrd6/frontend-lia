import { Link } from "react-router-dom";
import type { BoardType } from "../../types/board";

type Props = {
  board: BoardType;
  onClick: () => void;
};

export default function BoardHeader({ board, onClick }: Readonly<Props>) {
  return (
    <div className="flex flex-row items-center justify-evenly bg-gray-100">
      <header className="flex flex-row justify-center items-center">
        <nav className="flex flex-row  justify-between p-4 gap-4">
          <Link to="/boards/11111111-1111-1111-1111-111111111111">Board 1</Link>
          <Link to="/boards/11111111-1111-1111-1111-111111111112">Board 2</Link>
        </nav>
        <h1 className="text-xl font-bold">{board.title}</h1>
      </header>
      <button
        onClick={onClick}
        className="bg-black opacity-50 hover:opacity-60 text-white font-semibold py-2 px-4 rounded-2xl"
      >
        Connections
      </button>
    </div>
  );
}
