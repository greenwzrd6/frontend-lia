import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import PlacementCard from "./PlacementCard";

type Props = {
  column: ColumnType;
  placements: PlacementType[] | undefined;
  entities: EntityType[];
  boardId: string;
};

export default function PlacementList({
  placements,
  entities,
}: Readonly<Props>) {

  const visiblePlacements = placements 
  ? placements.filter((placement) => 
    entities.some((entity) => entity.Id === placement.entityId),
) : [];


  return (
      <div className="min-h-32 p-2">
        {visiblePlacements.map((placement, index) => {
          const entity = entities.find(
            (entity) => entity.Id === placement.entityId,
          );

          if (!entity) {
            return null;
          }

          return (
            <PlacementCard
              key={placement.entityId}
              entity={entity}
              placement={placement}
              index={index}
            />
          );
        })}
      </div>
  );
}
