import type { Column } from "../../types/column";
import type { Entity } from "../../types/entity";
import type { Placement } from "../../types/placement";

import PlacementCard from "./PlacementCard";

type Props = {
  column: Column;
  placements: Placement[];
  entities: Entity[];
};

export default function PlacementList({
column,
placements,
entities
}: Props) {
      const columnPlacements =
        placements
            .filter(
                placement =>
                    placement.columnId === column.id
            )
            .sort(
                (a, b) =>
                    a.position.localeCompare(
                        b.position
                    )
            );

                return (
        <div>
            {columnPlacements.map(placement => {
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
                    />
                );
            })}
        </div>
    );
}
