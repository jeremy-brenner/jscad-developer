const { exec } = require("child_process");
const mkdirp = require('mkdirp')
const { stlFolderName } = require('./stlTools.js');

function convert(fn,outputFn) {
    return new Promise( (res,rej) => {
        exec(`npx openjscad ${fn} -o ${outputFn}`, (error, stdout, stderr) => {
            if (error) {
                rej(error.message);
                return;
            }
            if (stderr) {
                rej(stderr);
                return;
            }
            res(outputFn);
        });
    });
}

module.exports = function(fn, stlFile) {
    return mkdirp(stlFolderName(fn))
      .then(() => convert(fn, stlFile));
}