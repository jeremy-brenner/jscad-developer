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

const modelPath = '/models';

app.use('/', express.static('public'))
//app.use('/stl', express.static('stl'))
app.use(modelPath, express.static(modelDir))

let ws;

wss.on('connection', (w) => {
   ws = w; 
   glob(`${modelDir}/**/*.jscad`, function (er, urls) {
       console.log(urls.map( u => u.replace(modelDir,modelPath)));
    sendEvent({type:"list",urls: urls.map( u => u.replace(modelDir,modelPath))})
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
    const stlFile = stlFileName(name);
    sendEvent({type, url: name.replace(modelDir,modelPath)});
    if(type == 'remove') {
        fs.unlink(stlFile)
            .catch(() => {});
    }else{
        console.log(`${name} changed, rendering`);
        jscadToStl(name, stlFile)
            .then(() => console.log('rendered'))
            .catch(error => {
                console.log(error);
               // sendEvent({type:'error', url, message: error});
            });
            
    }
}

watch(modelDir, { recursive: true }, fileChange );


server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
