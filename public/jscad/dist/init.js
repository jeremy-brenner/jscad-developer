function init() {
  var versionText = 'OpenJSCAD.org Version ' + version;
  console.log(versionText);

  // Show all exceptions to the user: // WARNING !! this is not practical at dev time
  AlertUserOfUncaughtExceptions();

  var viewer = document.getElementById('viewerContext');

  let renderStl = false;
  let fullPath = '';

  gProcessor = new Processor(viewer, {});
  gProcessor.onchange = (i) => { 
    if(renderStl) {
      gProcessor.formatDropdown.selectedIndex = 1; 
      parent.postMessage({action: 'saveStl', blob: gProcessor.currentObjectsToBlob(), fullPath});
    }
  }

  window.addEventListener("message", function(event) {    
    let source = event.data.source;
    fullPath = event.data.fullPath;
    renderStl = event.data.renderStl
    if (fullPath.match(/\.jscad$/i) || fullPath.match(/\.js$/i)) {   
      gProcessor.setJsCad(source, fullPath);
    }
  });
}