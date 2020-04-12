const re = /models(.*)\.jscad/;
const destDir = 'stl';
const fs = require('fs');

function stlFileName(fn) {
    const basename = re.exec(fn)[1];
    return `${destDir}${basename}.stl`;
  }
  
  function stlFolderName(fn) {
    return stlFileName(fn).split('/').slice(0,-1).join('/');
  }



module.exports = { stlFileName,  stlFolderName }