<script>    
  import File from './File.svelte';
  import { configStore } from './stores.js';
  const { dialog } = require('electron').remote

  let show;

  function showHide() {
    show = !show;
  }

  function selectDir() {
     dialog.showOpenDialog({ properties: ['openDirectory'] })
      .then(({canceled, filePaths}) => {
        if(canceled) {
          retrurn;
        }
        configStore.updateKey('startDirSelection', filePaths[0])
      });
  }

  function setStartDirRemember() {
    configStore.updateKey('startDirOption',"remember");
  }

  function setStartDirSelected() {
    configStore.updateKey('startDirOption',"selected");
  }
</script>


<configPage>
  <configPanel class:show="{show}">
    <div>Starting directory:</div>
    <div>
      <startDirOption on:click="{setStartDirRemember}" class:selected="{$configStore.startDirOption == 'remember'}">
        Remember my location
      </startDirOption>
      <startDirOption on:click="{setStartDirSelected}" class:selected="{$configStore.startDirOption == 'selected'}">
        Always start at selected location
      </startDirOption>
    </div>
    {#if $configStore.startDirOption == 'selected'}
      <div>
        <selectDir on:click="{selectDir}">Select location</selectDir>
        {$configStore.startDirSelection}
      </div>
    {/if}
  </configPanel>
  <icon on:click="{showHide}">
  </icon>
</configPage>

<style>
  configPage {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    pointer-events:none; 
    touch-action:none;
  }
  
  icon {
    display: block;
    right: 10px;
    bottom: 10px;
    width: 30px;
    height: 30px;
    position: absolute;
    pointer-events: auto; 
    touch-action: auto;
    cursor: pointer;
    background-image: url("../gear.png");
    background-repeat: no-repeat; 
    background-size: cover; 
  }

  configPanel {
    height: 100%;
    width: 100%;
    padding:10px;
    display: none;
    border: 1px solid black;
    background-color: white;
    overflow-x: scroll;
  }

  configPanel.show {
    display: inline-block;
    pointer-events: auto; 
    touch-action: auto;
  }

  startDirOption {
    cursor: pointer;
    border: 2px solid lightgrey;
  }

  startDirOption.selected {
    border-color: black;
  }
</style>