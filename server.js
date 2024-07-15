const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3000;

const iconMap = {
    "js": "fa-brands fa-js",
    "py": "fa-brands fa-python",
    "html": "fa-brands fa-html5",
    "css": "fa-brands fa-css3-alt",
    "java": "fa-brands fa-java",
    "react": "fa-brands fa-react",
    "php": "fa-brands fa-php",
    "csharp": "fa-brands fa-csharp",
    "ruby": "fa-brands fa-gem",
    "go": "fa-brands fa-go",
    "swift": "fa-brands fa-swift",
    "sql": "fa-solid fa-database",
    "c": "fa-brands fa-cuttlefish",
    "cpp": "fa-brands fa-cuttlefish",
    "r": "fa-brands fa-r",
    "bash": "fa-brands fa-linux",
    "docker": "fa-brands fa-docker",
    "kotlin": "fa-brands fa-kotlin",
    "typescript": "fa-brands fa-js",
    "markdown": "fa-solid fa-file-alt",
    "json": "fa-solid fa-code",
    "xml": "fa-solid fa-code",
    "yaml": "fa-solid fa-file-alt",
    "ini": "fa-solid fa-file-alt",
    "dart": "fa-brands fa-dart",
    "rust": "fa-brands fa-rust",
    "lua": "fa-brands fa-lua",
    "elm": "fa-brands fa-elm",
    "scala": "fa-brands fa-scala",
    "groovy": "fa-brands fa-java",
    "objectivec": "fa-brands fa-apple",
    "htm": "fa-brands fa-html5",
    "less": "fa-brands fa-css3-alt",
    "sass": "fa-brands fa-css3-alt",
    "svg": "fa-solid fa-image",
    "txt": "fa-solid fa-file-alt",
    "md": "fa-solid fa-file-alt",
    "vue": "fa-brands fa-vuejs",
    "angular": "fa-brands fa-angular",
    "svelte": "fa-brands fa-svelte",
    "jpg": "fa-solid fa-image",
    "jpeg": "fa-solid fa-image",
    "png": "fa-solid fa-image",
    "gif": "fa-solid fa-image",
    "pdf": "fa-solid fa-file-pdf",
    "zip": "fa-solid fa-file-archive",
    "tar": "fa-solid fa-file-archive",
    "gz": "fa-solid fa-file-archive",
    "7z": "fa-solid fa-file-archive",
    "exe": "fa-solid fa-cogs",
    "app": "fa-solid fa-cogs",
    "iso": "fa-solid fa-cogs",
    "dmg": "fa-solid fa-cogs",
    "ppt": "fa-solid fa-file-powerpoint",
    "xls": "fa-solid fa-file-excel",
    "doc": "fa-solid fa-file-word",
    "docx": "fa-solid fa-file-word",
    "mp3": "fa-solid fa-file-audio",
    "wav": "fa-solid fa-file-audio",
    "mp4": "fa-solid fa-file-video",
    "avi": "fa-solid fa-file-video",
    "mkv": "fa-solid fa-file-video",
    "mov": "fa-solid fa-file-video",
    "wmv": "fa-solid fa-file-video",
    "ts": "fa-brands fa-js",
    "log": "fa-solid fa-file-alt",
    "sql": "fa-solid fa-database"
};  

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'static')));

const wss = new WebSocket.Server({ port: 8080 });
let mostRecentMessage = null;

wss.on('connection', function connection(ws) {
  if (mostRecentMessage && client !== ws) {
    ws.send(mostRecentMessage);
  }

  ws.on('message', function incoming(message) {
    console.log('WebSocket received data: %s', message);

    try {
      const data = JSON.parse(message);
      const fileType = data.fileType.toLowerCase().replace('.', '');
      const iconClass = iconMap[fileType] || 'fa-solid fa-file';
      data.status = `<i class="${iconClass}"></i> ${data.status}`;
      const updatedMessage = JSON.stringify(data);
      mostRecentMessage = updatedMessage;
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
          client.send(updatedMessage);
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
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