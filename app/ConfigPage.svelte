<script>    
  import File from './File.svelte';
  import { configStore } from './stores.js';
  const { dialog } = require('electron').remote

  let show;

  function showHide() {
    show = !show;
  }

  function selectDir(key) {
     dialog.showOpenDialog({ properties: ['openDirectory'] })
      .then(({canceled, filePaths}) => {
        if(canceled) {
          retrurn;
        }
        configStore.updateKey(key, filePaths[0])
      });
  }

  function setStartDirRemember() {
    configStore.updateKey('startDirBehavior',"remember");
  }

  function setStartDirSelected() {
    configStore.updateKey('startDirBehavior',"selected");
  }

  function setOutputStl() {
    configStore.toggleKey('outputStl');
  }
</script>


<configPage>
  <configPanel class:show="{show}">
    <h1>Home</h1>
    <div>
      <startDirOption on:click="{setStartDirRemember}" class='selectable' class:selected="{$configStore.startDirBehavior == 'remember'}">
        Remember my location
      </startDirOption>
      <startDirOption on:click="{setStartDirSelected}" class='selectable' class:selected="{$configStore.startDirBehavior == 'selected'}">
        Always start at selected location
      </startDirOption>
    </div>
    {#if $configStore.startDirBehavior == 'selected'}
      <div>
        <selectDir on:click="{() => selectDir("startDir")}">Select location</selectDir>
        {$configStore.startDir}
      </div>
    {/if}
    <h1>STL</h1>
    <div>
      <outputStlOption on:click="{setOutputStl}" class='selectable' class:selected="{$configStore.outputStl}">
        Output STL on update
      </outputStlOption>
      {#if $configStore.outputStl}
        <div>
          <selectDir on:click="{() => selectDir("stlDir")}">Select location</selectDir>
          {$configStore.stlDir}
        </div>
      {/if}
    </div>
  </configPanel>
  <icon on:click="{showHide}">
  </icon>
</configPage>

<style>
  div {
    margin-top: 10px;
  }

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

  selectDir {
    cursor: pointer;
    background-color:lightgrey;
    border: 1px solid black;
  }

  .selectable {
    cursor: pointer;
    border: 2px solid lightgrey;
  }

  .selectable.selected {
    border-color: black;
  }
</style>