import { renderHook, waitFor } from "@testing-library/react";

import { createQueryWrapper } from "../queryWrapper";
import type { ColumnType } from "../../types/column";
import { getColumnsByBoardId } from "../../services/columnApi";
import { useColumns } from "../../hooks/useColumns";

jest.mock("../../services/columnApi", () => ({
  getColumnsByBoardId: jest.fn(),
}));

describe("getColumnsByBoardId", () => {
  test("fetches and returns the requested columns", async () => {
    // Arrange
    const boardId = "123";

    const columns: ColumnType[] = [
      {
        id: "1",
        boardId: boardId,
        title: "Test Column",
        position: 0,
        requestWritable: true,
      },
    ];

    jest.mocked(getColumnsByBoardId).mockResolvedValue(columns);

    const { wrapper, qc } = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useColumns(boardId), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(columns);
    });

    expect(getColumnsByBoardId).toHaveBeenCalledWith(boardId);

    qc.clear();
  });
});
