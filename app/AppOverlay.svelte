<appOverlay>
    <slot></slot>
</appOverlay>

<style>
  appOverlay {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    pointer-events:none; 
    touch-action:none;
  }
</style>