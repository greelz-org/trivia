import { io } from "socket.io-client";

export default function Connection() {
  const socket = io("http://localhost:3200");

  socket.on("connect", () => {
    console.log("Connected to the server socket...");
  });
}
