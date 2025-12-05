import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Hook to handle websocket connection per game
export function useGameWebSocket(gameId, onMessage) {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    if (!gameId) return;

    const socket = new SockJS(API_BASE + "/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // auto reconnect every 5s
      debug: (str) => {}
      //console.log("STOMP:", str)
      ,
      onConnect: () => {
        setIsConnected(true);
        console.log("✅ Connected to WebSocket");
        client.subscribe(`/topic/games/${gameId}`, (message) => {
          const event = JSON.parse(message.body);
          console.log("📩 Received event:", event);
          if (onMessage) onMessage(event);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      setIsConnected(false);
      console.log("🔌 Disconnecting WebSocket");
      client.deactivate();
    };
  }, [gameId, onMessage]);

  return { isConnected };
}
