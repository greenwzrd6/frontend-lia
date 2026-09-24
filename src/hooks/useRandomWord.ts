import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

type RandomWord = {
  word: string;
  definition: string;
};

export function useRandomWord() {
  const [randomWord, setRandomWord] = useState<RandomWord | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7265/hubs/board")
      .withAutomaticReconnect()
      .build();

    connection.on("RandomWordReceived", (result: RandomWord) => {
      setRandomWord(result);
    });

    connection.start();

    return () => {
      connection.stop();
    };
  }, []);

  return randomWord;
}
