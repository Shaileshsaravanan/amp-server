const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));  
app.use('/static', express.static(path.join(__dirname, 'static'))); 

const wss = new WebSocket.Server({ port: 8080 });
let mostRecentMessage = null;

wss.on('connection', function connection(ws) {
  if (mostRecentMessage) {
    ws.send(mostRecentMessage);
  }

  ws.on('message', function incoming(message) {
    console.log('WebSocket received data: %s', message);
    mostRecentMessage = message;  
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('A client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});