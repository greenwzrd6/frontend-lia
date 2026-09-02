import { apiRequest } from "./api";
import type { PlacementType } from "../types/placement";

export type CreatePlacementRequest = {
    entityId: string;
    columnId: string;
    afterEntityId: string | null;
    beforeEntityId: string | null;
};

export async function getPlacement(
    entityId: string,
    columnIds: string[]
): Promise<PlacementType | null> {
    const params = new URLSearchParams();

    params.set("entityId", entityId);

    for (const columnId of columnIds) {
        params.append(
            "columnIds",
            columnId
        );
    }

    try {
        return await apiRequest<PlacementType>(
            `/api/placements/get?${params.toString()}`
        );
    }
    catch (error) {
        /*
         * The current API uses 404 when no placement exists.
         *
         * A production implementation should ideally
         * distinguish 404 from other errors in the shared
         * API helper. For the first prototype, this can be
         * handled here if necessary.
         */
        return null;
    }
}

export async function createPlacement(
    request: CreatePlacementRequest
): Promise<void> {
    await apiRequest<void>(
        "/api/placements/create",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    );
}