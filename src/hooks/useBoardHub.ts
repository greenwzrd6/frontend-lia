import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_API_URL;

export function useBoardHub(onPlacementChanged: () => void) {
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/board`)
      .withAutomaticReconnect()
      .build();

    connection.on("PlacementChanged", onPlacementChanged);

    connection
      .start()
      .then(() => console.log("signalr connected"))
      .catch(console.error);

    return () => {
      connection.stop();
    };
  }, [onPlacementChanged]);
}
