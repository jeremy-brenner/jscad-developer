function init() {
  var versionText = 'OpenJSCAD.org Version ' + version;
  console.log(versionText);

  // Show all exceptions to the user: // WARNING !! this is not practical at dev time
  AlertUserOfUncaughtExceptions();

  var viewer = document.getElementById('viewerContext');

  gProcessor = new Processor(viewer, {});

  window.addEventListener("message", function(event) {
    let design = event.data.design;
    let source = event.data.source;
    if (design.match(/\.jscad$/i) || design.match(/\.js$/i)) {
      gProcessor.setJsCad(source, design);
    }
  });
}
