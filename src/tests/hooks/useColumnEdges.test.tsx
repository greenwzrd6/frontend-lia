import { renderHook, waitFor } from "@testing-library/react";

import { getColumnEdgesByBoardId } from "../../services/columnEdgeApi";
import type { ColumnEdgeType } from "../../types/columnEdge";
import { useColumnEdges } from "../../hooks/useColumnEdges";
import { createQueryWrapper } from "../queryWrapper";

jest.mock("../../services/columnEdgeApi", () => ({
  getColumnEdgesByBoardId: jest.fn(),
}));

describe("getColumnEdgesByBoardId", () => {
  test("fetches and returns the requested edges", async () => {
    // Arrange
    const boardId = "123";

    const edges: ColumnEdgeType[] = [
      {
        fromColumnId: "1",
        toColumnId: "2",
      },
    ];

    jest.mocked(getColumnEdgesByBoardId).mockResolvedValue(edges);

    const { wrapper, qc } = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useColumnEdges(boardId), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(edges);
    });

    expect(getColumnEdgesByBoardId).toHaveBeenCalledWith(boardId);

    qc.clear();
  });
});
