<script>
  import { currentFileChangeStore } from './stores.js';
  const fs = require('fs');

  let jscadIframe;

  currentFileChangeStore.subscribe(change => change && loadFile(change.fullPath));

  function loadFile(fullPath) {
    if(!fullPath) {
      return;
    }
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