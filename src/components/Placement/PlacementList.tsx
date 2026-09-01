import type { Entity } from "../../types/entity";
import type { Placement } from "../../types/placement";

import PlacementCard from "./PlacementCard";

type Props = {
  placements: Placement[];
  entities: Entity[];
};

export default function PlacementList({
  placements,
  entities,
}: Readonly<Props>) {
  const sortedPlacements = [...placements].sort((a, b) =>
    a.position.localeCompare(b.position),
  );

  return (
    <div>
      {sortedPlacements.map((placement) => {
        const entity = entities.find(
          (entity) => entity.id === placement.entityId,
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
