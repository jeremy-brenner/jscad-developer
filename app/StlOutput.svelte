<script>
	import { onDestroy } from 'svelte';
  
  const fs = require('fs');
  const path = require('path');

  export let stlDir;

  onDestroy(() => {
    window.removeEventListener("message", (message) => handleMessage(message) );
  });

  window.addEventListener("message", (message) => handleMessage(message) );

  function handleMessage({data}) {
    if(data.action == 'saveStl') {
      const baseName = path.basename(data.fullPath, '.jscad');
      const destFile = path.join(stlDir,`${baseName}.stl`);
      data.blob.arrayBuffer()
        .then(arrayBuffer => new Uint8Array(arrayBuffer))
        .then(uint8Array => new Buffer(uint8Array))
        .then(buffer => fs.writeFileSync(destFile,buffer) );
    }
  }

</script>
