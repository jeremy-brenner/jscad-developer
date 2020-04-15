function init() {
    var versionText = 'OpenJSCAD.org Version ' + version;
    console.log(versionText);
  
    // Show all exceptions to the user: // WARNING !! this is not practical at dev time
    AlertUserOfUncaughtExceptions();
  
    var viewer = document.getElementById('viewerContext');
    var design = viewer.getAttribute('design-url');
  
    gProcessor = new Processor(viewer, {});
  
    window.addEventListener("message", function(event) {
      let design = event.data;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', design, true);
      gProcessor.setStatus('Loading ' + design + " <img id=busy src='imgs/busy.gif'>");
  
      xhr.onload = function () {
        var source = this.responseText;
  
        if (design.match(/\.jscad$/i) || design.match(/\.js$/i)) {
          gProcessor.setStatus('Processing ' + design + " <img id=busy src='imgs/busy.gif'>");
          gProcessor.setJsCad(source, design);
        }
      };
      xhr.send();
    });
  }