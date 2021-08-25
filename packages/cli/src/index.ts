import WebSocket from "ws";
import readline from "readline";

const TTY_PREFIX = ">";

const ws = new WebSocket("ws://localhost:8080");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createPrompt(): void {
  rl.setPrompt(TTY_PREFIX);
  rl.prompt();
  rl.on("line", (line) => {
    ws.send(line);
  });
}

ws.on("open", () => {
  createPrompt();
});

ws.on("message", (message: Buffer) => {
  rl.write(message.toString());
});

ws.on("close", () => {
  process.exit(0);
});
