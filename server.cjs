const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 3000;

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//define routes
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'html', 'main.html')); });

//serve data
app.get('/json/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'public', 'json', `${filename}.json`));
});
app.get('/fonts/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'public', 'fonts', `${filename}.TTF`));
});

//WebSocket Server
const wss = new WebSocketServer({ noServer: true });
let connections = [];

wss.on('connection', (ws) => {
  connections.push(ws);
  ws.on('message', (message) => {
    connections.forEach((conn) => {
      if (conn != ws && conn.readyState === conn.OPEN) {
        conn.send(message.toString());
        console.log(message.toString());
      }
    });
  });
  ws.on('close', () => {
    connections = connections.filter((conn) => conn !== ws);
  });
});

const server = app.listen(PORT, () => {
  consol.log(`Server is running at http://localhost:${PORT}`);
});
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
