import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";

import type { PlacementCreatedEvent } from "../types/placement";
import { API_URL } from "../services/api";

export function useBoardHub(
  onPlacementCreated: (event: PlacementCreatedEvent) => void,
) {
  const callbackRef = useRef(onPlacementCreated);

  useEffect(() => {
    callbackRef.current = onPlacementCreated;
  }, [onPlacementCreated]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/board`)
      .withAutomaticReconnect()
      .build();

      const handlePlacementCreated = (event: PlacementCreatedEvent) => {
        callbackRef.current(event);
      };

    connection.on("PlacementCreated", handlePlacementCreated);

    let cancelled = false;

    async function startConnection() {
      try {
        console.log("SignalR: starting")

        await connection.start();

        if (cancelled!) {
          console.log("SignalR connected")
        }
      } catch (e) {
        if (!cancelled) {
          console.error("SignalR connection failed:", e)
        }
      }
    }

    startConnection();

    return () => {
      console.log("SignalR: cleanup")
      cancelled = true;

      connection.off(
        "PlacementCreated",
        handlePlacementCreated,
      );

      if (
        connection.state !== HubConnectionState.Disconnected
      ) {
        void connection.stop(); 
      }
    };
  }, []);
}