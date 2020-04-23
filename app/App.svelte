<script>
    import FileList from './FileList.svelte';
    import ConfigPage from './ConfigPage.svelte';
    import JscadView from './JscadView.svelte';
    import StlOutput from './StlOutput.svelte';
    import { configStore } from './stores.js';
</script>

<main>
  <FileList/>
  <ConfigPage/>
  <JscadView/>
  {#if $configStore.outputStl}
    <StlOutput stlDir={$configStore.stlDir}/>
  {/if}
</main>

<style>
	
</style>