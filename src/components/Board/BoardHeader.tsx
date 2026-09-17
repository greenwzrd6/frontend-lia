import { Link } from "react-router-dom";
import type { BoardType } from "../../types/board";

type Props = {
  board: BoardType;
};

export default function BoardHeader({ board }: Readonly<Props>) {
  return (
    <header className="flex flex-row justify-center items-center mb-2">
      <nav className="flex flex-row  justify-between p-4 gap-4">
        <Link to="/boards/11111111-1111-1111-1111-111111111111">
          Board 1
        </Link>
        <Link to="/boards/11111111-1111-1111-1111-111111111112">
          Board 2
        </Link>
      </nav>
      <h1 className="text-xl font-bold">{board.title}</h1>
    </header>
  );
}
