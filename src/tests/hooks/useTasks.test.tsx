import { renderHook, waitFor } from "@testing-library/react";

import { createQueryWrapper } from "../queryWrapper";
import { getTasksByProjectId } from "../../services/taskApi";
import type { TaskType } from "../../types/task";
import { useTasks } from "../../hooks/useTasks";

jest.mock("../../services/taskApi", () => ({
  getTasksByProjectId: jest.fn(),
}));

describe("getTasksByProjectId", () => {
  test("fetches and returns the requested tasks", async () => {
    // Arrange
    const PROJECT_ID = "3e034485-2d34-f111-ae9c-3cecef9b8585";

    const tasks: TaskType[] = [
      {
        id: "1",
        parentId: null,
        title: "Test Task",
      },
    ];

    jest.mocked(getTasksByProjectId).mockResolvedValue(tasks);

    const { wrapper, qc } = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useTasks(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(tasks);
    });

    expect(getTasksByProjectId).toHaveBeenCalledWith(PROJECT_ID);

    qc.clear();
  });
});
