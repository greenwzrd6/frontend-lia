import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from "../services/api";

export function useBoardHub(onPlacementChanged: () => void) {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/board`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if(connection) {
      connection.start().then(() => {
        connection.on("PlacementChanged", () => onPlacementChanged());
      }).catch(e => console.log(e));
    }
  }, [connection])
}