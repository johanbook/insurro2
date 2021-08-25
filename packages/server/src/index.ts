import WebSocket from "ws";
import { spawn } from "node:child_process";

const wss = new WebSocket.Server({ port: 8080 });

function broadcast(data: Buffer | string, prefix?: string): void {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`${prefix}${data}`);
    }
  });
}

wss.on("connection", (ws: WebSocket, req) => {
  const uid = req.socket.remoteAddress;
  const userPrefix = `${uid}> `;
  const resultPrefix = `${uid}| `;
  console.log("New connection", uid);

  ws.on("message", (message: Buffer) => {
    const cmd = message.toString();
    broadcast(cmd, userPrefix);

    const spwn = spawn(cmd);
    spwn.stdout.on("data", (data: Buffer) => broadcast(data, resultPrefix));
    spwn.stderr.on("data", (data: Buffer) => ws.send(data));
    spwn.on("error", (error) => broadcast(error.message, resultPrefix));
  });

  ws.send("welcome");
});
