import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getColumnsByBoardId } from "../services/columnApi";

export function useColumns() {
    const { id } = useParams<{ id: string }>();

    return useQuery({
        queryKey: ["columns", id],
        queryFn: () => getColumnsByBoardId(id!),
        enabled: !!id,
    });
}

