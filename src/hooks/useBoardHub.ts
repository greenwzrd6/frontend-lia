import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from "../services/api";

import type { PlacementType } from "../types/placement";

export function useBoardHub(
  onPlacementChanged: (placement: PlacementType) => void,
) {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/board`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("PlacementChanged", (placement: PlacementType) => {
            onPlacementChanged(placement);
          });
        })
        .catch((e) => console.log(e));
    }
  }, [connection, onPlacementChanged]);
}
