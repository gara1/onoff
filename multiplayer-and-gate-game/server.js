const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let players = [];
let inputs = { player1: false, player2: false };

wss.on('connection', (ws) => {
  if (players.length < 2) {
    players.push(ws);
    const playerIndex = players.indexOf(ws) + 1;
    ws.send(JSON.stringify({ type: 'player', id: playerIndex }));
    
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      
      if (data.type === 'input') {
        inputs[`player${data.player}`] = data.state;

        // Calculate AND result
        const andResult = inputs.player1 && inputs.player2;
        
        // Send result to both players
        players.forEach((player) => {
          player.send(JSON.stringify({ type: 'result', andResult }));
        });
      }
    });

    ws.on('close', () => {
      players = players.filter(p => p !== ws);
      inputs = { player1: false, player2: false };
    });
  } else {
    ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
    ws.close();
  }
});

console.log('WebSocket server running on ws://localhost:8080');
