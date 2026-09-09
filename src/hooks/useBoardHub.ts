import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

import type { PlacementCreatedEvent } from "../types/placement";
import { API_URL } from "../services/api";

export function useBoardHub(
  onPlacementCreated: (event: PlacementCreatedEvent) => void,
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
    if (!connection) return;

    connection
      .start()
      .then(() => {
        connection.on("PlacementCreated", (event: PlacementCreatedEvent) => {
          onPlacementCreated(event);
        });
      })
      .catch((e) => {
        console.error("SignalR connection failed:", e);
      });
  }, [connection, onPlacementCreated]);
}
