
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs-extra'));

function build(project){
  return fs.copyAsync('structure', project, {clobber: true})
    .then(function(err){
        if (err) {
        	return console.error(err)
        }
        console.log('success: entry name ' + project);
    })
}

module.exports = build;