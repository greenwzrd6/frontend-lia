import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useBoard } from "../../hooks/useBoard";
import { getBoard } from "../../services/boardApi";
import type { BoardType } from "../../types/board";

jest.mock("../../services/boardApi", () => ({
  getBoard: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useParams: () => ({ id: "123" }),
  };
});

describe("useBoard", () => {
  test("fetches and returns the requested board", async () => {
    const board: BoardType = {
      id: "123",
      title: "Test Board",
      roots: [],
    };

    jest.mocked(getBoard).mockResolvedValue(board);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBoard(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(board);
    });

    expect(getBoard).toHaveBeenCalledWith("123");

    queryClient.clear();
  });
});
