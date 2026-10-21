import { renderHook, waitFor } from "@testing-library/react";

import { createQueryWrapper } from "../queryWrapper";
import { getPlacementsByColumn } from "../../services/placementApi";
import type { PlacementType } from "../../types/placement";
import { usePlacementsByColumn } from "../../hooks/usePlacementsByColumn";

jest.mock("../../services/placementApi", () => ({
  getPlacementsByColumn: jest.fn(),
}));

describe("getPlacementsByColumn", () => {
  test("fetches and returns the requested placements", async () => {
    // Arrange
    const boardId = "123";

    const columnId = "1";

    const placements: PlacementType[] = [
      {
        entityId: "1",
        boardId: boardId,
        columnId: "0",
        timeStamp: "",
        sortKey: "",
        sourceColumnId: "",
        targetColumnId: "",
      },
    ];

    jest.mocked(getPlacementsByColumn).mockResolvedValue(placements);

    const { wrapper, qc } = createQueryWrapper();

    // Act
    const { result } = renderHook(
      () => usePlacementsByColumn(columnId, boardId, true),
      { wrapper },
    );

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(placements);
    });

    expect(getPlacementsByColumn).toHaveBeenCalledWith(columnId, boardId);

    qc.clear();
  });
});
