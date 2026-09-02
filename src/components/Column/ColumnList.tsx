import type { Entity as EntityType } from "../../types/entity";
import Column from "./Column";
import EntityColumnMock from "./EntityColumnMock";

type Props = {
  entities: EntityType[];
  getPlacements: () => Promise<void>;
};

export default function ColumnList({
  entities,
  getPlacements,
}: Readonly<Props>) {
  return (
    <div className="flex justify-evenly">
      <EntityColumnMock entities={entities} />
          <Column
            entities={entities}
            getPlacements={getPlacements}
          />
    </div>
  );
}
