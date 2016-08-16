
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs-extra'));

function build(project){
  return fs.copyAsync(__dirname + '\\directory', project)
    .then(function(err){
        if (err) {
        	return console.error(err)
        }
        console.log(project + 'project success');
    });
}
module.exports = build;