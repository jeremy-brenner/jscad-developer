const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const watch = require('node-watch');
const jscadToStl = require("./lib/jscadToStl.js");
const { stlFileName } = require('./lib/stlTools.js');
const fs = require('fs').promises;
var glob = require("glob")

let modelDir;

if(process.argv[2]) {
    modelDir = process.argv[2];
}else{
    console.log('Please specify a model folder.')
    process.exit();
}

const app = express();
const port = 3000;

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

app.use('/', express.static('public'))
app.use('/stl', express.static('stl'))

let ws;

wss.on('connection', (w) => {
   ws = w; 
   glob("stl/**/*.stl", function (er, urls) {
    sendEvent({type:"list",urls})
   })
});

console.log(`watching ${modelDir} for changes...`);
  
const sendEvent = (event) => {
    if(ws) {
         ws.send(JSON.stringify(event));
    }else{
        console.log('websocket not connected');
    }
}

const fileChange = (type,name) => {
    const url = stlFileName(name);
    if(type == 'remove') {
        fs.unlink(url)
            .catch(() => {})
            .then(() => sendEvent({type, url}));
    }else{
        console.log(`${name} changed, rendering`);
        jscadToStl(name, url)
            .then(() => console.log('rendered, sending event'))
            .then(() => sendEvent({type, url}))
            .catch(error => {
                console.log(error);
                sendEvent({type:'error', url, message: error});
            });
            
    }
}

watch(modelDir, { recursive: true }, fileChange );


server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
