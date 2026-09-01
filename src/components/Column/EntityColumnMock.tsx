import type { Entity as EntityType } from "../../types/entity";
import { handleDragStart } from "../../utils/DragAndDrop";

type Props = {
  entities: EntityType[];
};

export default function EntityColumnMock({ entities }: Readonly<Props>) {
  return (
    <section>
      <h2>Jajjamän</h2>

      {entities.map((entity) => (
        <span
          className="entity-mock-card"
          key={entity.id}
          draggable
          onDragStart={(event) =>
            handleDragStart(event, entity.id)
          }
        >
          {entity.title}
        </span>
      ))}
    </section>
  );
}