<script>
  import AppOverlay from './AppOverlay.svelte';
  import FileList from './FileList.svelte';
  import ConfigPage from './ConfigPage.svelte';
  import JscadView from './JscadView.svelte';
  import StlOutput from './StlOutput.svelte';
  import Status from './Status.svelte';
  import { configStore } from './stores.js';
</script>

<main>
  <AppOverlay>
    <Status/>
  </AppOverlay>
  <FileList/>
  <ConfigPage/>
  <JscadView renderStl={$configStore.outputStl}/>
  {#if $configStore.outputStl}
    <StlOutput stlDir={$configStore.stlDir}/>
  {/if}
</main>

<style>
	
</style>