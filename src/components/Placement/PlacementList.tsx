import type { DragEvent } from "react";
import type { Entity } from "../../types/entity";
import type { Placement } from "../../types/placement";

import PlacementCard from "./PlacementCard";
import { createPlacement } from "../../services/PlacementApi";

type Props = {
    columnId: string;
    placements: Placement[];
    entities: Entity[];
    reloadPlacements: () => Promise<void>;
};

export default function PlacementList({
    columnId,
    placements,
    entities,
    reloadPlacements
}: Props) {

    const sortedPlacements =
        [...placements].sort(
            (a, b) =>
                a.position.localeCompare(
                    b.position
                )
        );

    async function handleDropBefore(
        draggedEntityId: string,
        targetEntityId: string
    ) {
        await createPlacement({
            entityId: draggedEntityId,
            columnId,
            afterEntityId: null,
            beforeEntityId: targetEntityId
        });

        await reloadPlacements();
    }

    async function handleDropAtEnd(
        event: DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        const draggedEntityId =
            event.dataTransfer.getData("text/plain");

        if (!draggedEntityId) {
            return;
        }

        const remainingPlacements =
            sortedPlacements.filter(
                placement =>
                    placement.entityId !==
                    draggedEntityId
            );

        const lastPlacement =
            remainingPlacements.at(-1);

        await createPlacement({
            entityId: draggedEntityId,
            columnId,
            afterEntityId:
                lastPlacement?.entityId ?? null,
            beforeEntityId: null
        });

        await reloadPlacements();
    }

    return (
        <div
            onDragOver={(event) =>
                event.preventDefault()
            }
            onDrop={handleDropAtEnd}
        >
            {sortedPlacements.map(placement => {
                const entity =
                    entities.find(
                        entity =>
                            entity.id ===
                            placement.entityId
                    );

                if (!entity) {
                    return null;
                }

                return (
                    <PlacementCard
                        key={placement.entityId}
                        entity={entity}
                        placement={placement}
                        onDropBefore={
                            handleDropBefore
                        }
                    />
                );
            })}
        </div>
    );
}