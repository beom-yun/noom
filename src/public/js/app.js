const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to the server ✅");
});

socket.addEventListener("message", (message) => {
  console.log(`New message: ${message.data}`);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from the server ❌");
});

setTimeout(() => {
  socket.send("Hello from the browser!");
}, 10000);
