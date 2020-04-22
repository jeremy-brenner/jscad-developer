<script>
  import { currentFileStore } from './stores.js';
  const fs = require('fs');
  const watch = require('node-watch');

  let jscadIframe;
  let watcher;

  currentFileStore.subscribe( fullPath => { 
    watcher && watcher.close();
    if(fullPath) {
      watcher = watch(fullPath, () => loadFile(fullPath));
      loadFile(fullPath);
    }
  });

  function loadFile(fullPath) {
    fs.readFile(fullPath, (err,fileData) => {
       jscadIframe.contentWindow.postMessage({'design': fullPath, 'source': new TextDecoder("utf-8").decode(fileData)})
    });
  }

</script>
<iframe title="jscad" src="jscad/viewer-options.html" bind:this={jscadIframe} scrolling="no"></iframe>

<style>
  iframe {
      border: none;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
  }
</style>