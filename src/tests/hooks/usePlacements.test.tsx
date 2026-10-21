import { renderHook, waitFor } from "@testing-library/react";

import { createQueryWrapper } from "../queryWrapper";
import type { TaskType } from "../../types/task";
import {
  createMissingPlacements,
  getPlacements,
} from "../../services/placementApi";
import type { PlacementType } from "../../types/placement";
import { usePlacements } from "../../hooks/usePlacements";
import type { ColumnType } from "../../types/column";

jest.mock("../../services/placementApi", () => ({
  getPlacements: jest.fn(),
  createMissingPlacements: jest.fn(),
}));

describe("getPlacements", () => {
  test("fetches and returns the requested placements", async () => {
    // Arrange
    const entities: TaskType[] = [
      {
        id: "1",
        parentId: null,
        title: "Test Task",
      },
    ];

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

    jest.mocked(getPlacements).mockResolvedValue(placements);
    jest.mocked(createMissingPlacements).mockResolvedValue(undefined);

    const { wrapper, qc } = createQueryWrapper();

    // Act
    const { result } = renderHook(
      () => usePlacements(entities, boardId, columns),
      { wrapper },
    );

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(placements);
    });

    expect(getPlacements).toHaveBeenCalledWith(["1"], boardId);
    expect(createMissingPlacements).toHaveBeenCalledWith(
      entities,
      placements,
      boardId,
      columns,
    );

    qc.clear();
  });
});
