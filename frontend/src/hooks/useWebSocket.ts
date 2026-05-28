import { useState, useEffect } from 'react';

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      setData(event.data);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return data;
};
