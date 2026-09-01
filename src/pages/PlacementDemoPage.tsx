import type { Placement } from "../types/placement";
import PlacementList from "../components/Placement/PlacementList";
import { mockEntities } from "../services/mockEntities";
import type { Column } from "../types/column";

const mockColumn: Column = {
    id: "10000000-0000-0000-0000-000000000001",
    title: "Todo",
    position: 0,
    boardId: "20000000-0000-0000-0000-000000000001"
};

const mockPlacements: Placement[] = [
    {
        entityId: "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
        columnId: "10000000-0000-0000-0000-000000000001",
        position: "e",
        timeStamp: new Date().toISOString()
    },
        {
        entityId: "7c9e6679-7425-40de-944b-e07fc1f90ae2",
        columnId: "10000000-0000-0000-0000-000000000001",
        position: "c",
        timeStamp: new Date().toISOString()
    },
            {
        entityId: "550e8400-e29b-41d4-a716-446655440003",
        columnId: "10000000-0000-0000-0000-000000000001",
        position: "d",
        timeStamp: new Date().toISOString()
    }
];

export default function PlacementDemoPage() {
    return (
        <main>
            <h1>Placement Demo</h1>

            <PlacementList
                column={mockColumn}
                placements={mockPlacements}
                entities={mockEntities}
            />
        </main>
    );
}