import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../services/boardApi";
import { useParams } from "react-router-dom";

export function useBoard() {
    const { id } = useParams<{ id: string }>();

    return useQuery({
        queryKey: ["board", id],
        queryFn: () => getBoard(id!),
        enabled: !!id,
    });
}


