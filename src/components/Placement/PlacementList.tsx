import type { Column } from "../../types/column";
import type { Entity } from "../../types/entity";
import type { Placement } from "../../types/placement";

type Props = {
  column: Column;
  placements: Placement[];
  entities: Entity[];
};
