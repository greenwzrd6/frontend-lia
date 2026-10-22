import { renderHook, waitFor } from "@testing-library/react";

import { useBoard } from "../../hooks/useBoard";
import { getBoard } from "../../services/boardApi";
import type { BoardType } from "../../types/board";
import { createQueryWrapper } from "../queryWrapper";

jest.mock("../../services/boardApi", () => ({
  getBoard: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual =
    jest.requireActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useParams: () => ({ id: "123" }),
  };
});

describe("useBoard", () => {
  // Arrange
  test("fetches and returns the requested board", async () => {
    const board: BoardType = {
      id: "123",
      title: "Test Board",
      roots: [],
    };

    jest.mocked(getBoard).mockResolvedValue(board);

    const { wrapper, qc } = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useBoard(), { wrapper });

    // Arrange
    await waitFor(() => {
      expect(result.current.data).toEqual(board);
    });

    expect(getBoard).toHaveBeenCalledWith(board.id);

    qc.clear();
  });
});
