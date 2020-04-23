<script>
	import { onDestroy } from 'svelte';
  import { currentFileChangeStore } from './stores.js';
  const { exec } = require("child_process");
  const path = require('path');

  export let stlDir;

  const unsubscribe = currentFileChangeStore.subscribe(change => change && convert(change.fullPath));

  onDestroy(unsubscribe);

  function convert(fullPath) {
    const baseName = path.basename(fullPath, '.jscad');
    const destFile = path.join(stlDir,`${baseName}.stl`);
    exec(`npx openjscad ${fullPath} -o ${destFile}`, (error, stdout, stderr) => {
       console.log('stl convert', {error, stdout, stderr});
    });
  }

</script>
